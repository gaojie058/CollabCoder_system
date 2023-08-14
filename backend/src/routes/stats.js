const express = require("express");
const statsRouter = express.Router();
const calcCohenKappa = require('../api/calculate_kappa');
const { PythonShell } = require('python-shell');

const dbo = require("../db/Connection");
const similarities_collection = "similarities"
const project_collection = "projects"

/*
// 1. collect all the word_pairs and send it to python once. 
// (this means we can only do one time post and request)
// 2. send it to python as a vector, instead of one pair by one pair, 
// which may calculate all the results at once
3. show the progress of calculation on the interface 
(like a information window showing how many it has calculated), 
give the estimated time left
*/


// validate the words
const isValidWord = (word) => {
  const unValidList = [undefined, null, "", '[]', []]
  return !unValidList.includes(word)
}


// extract words

const get_validated_words = (sentence, codersToCompare) => {

  let words = sentence.codes
    .filter((element) => codersToCompare
      .includes(element.author))
    .map(e => e.code);

  if (words.length >= 2) {
    return [isValidWord(words[0]) ? words[0] : "", isValidWord(words[1]) ? words[1] : ""];
  } else {
    return ["", ""];
  }
};

const search_DB = async (sentence_id, word1, word2, coll) => {
  try {
    const cursor = await coll.find({ $or: [{ word1: word1, word2: word2 }, { word1: word2, word2: word1 }] }); // find with queries
    const value = Array();
    await cursor.forEach(e => {
      value.push(e);
    })

    if (value.length > 0) {
      console.log(`${word1} ${word2} found in database, score: ${value[0].sim_score}`)

      return {
        sentence_id: sentence_id,
        word1: word1,
        word2: word2,
        score: parseFloat(value[0].sim_score),
      }

    } else {
      console.log(`${word1} ${word2}  not found in database, this is a new calculation.`)
      wordPair = [word1, word2]
      return {
        sentence_id: sentence_id,
        word1: word1,
        word2: word2,
        score: null,
      }
    }

  } catch (e) { console.log(`search_DB: ${e}`) }
}

// calculate similarity
const calSim = async (words, sim_collection) => {
  // [{
  //   sentence_id: sentence.id,
  //   word1: word1,
  //   word2: word2
  // }]
  return new Promise((resolve, reject) => {

    console.log("Searching existing data...")
    const promises = []
    words.forEach(async element => {
      promises.push(search_DB(element.sentence_id, element.word1, element.word2, sim_collection))
    });

    Promise.all(promises).then(scores_dic => {
      // res = [...{
      //   sentence_id: 39,
      //   word1: 'highly recommended',
      //   word2: 'Will be back',
      //   score: 0.493
      // },
      // {
      //   sentence_id: 40,
      //   word1: 'highly recommended',
      //   word2: 'Will be back',
      //   score: null
      // },]
      const wordsList = []
      scores_dic.forEach(r => {
        if (r.score == null) {
          wordsList.push({
            sentence_id: r.sentence_id,
            word1: r.word1,
            word2: r.word2
          })
        }
      })

      if (wordsList.length == 0) {
        resolve(scores_dic)
      } else {
        console.log("Loading model for similarity calculation...")
        let options = {
          pythonPath: process.env.PYTHON_PATH,
          mode: 'text',
          pythonOptions: ['-u'],
          scriptPath: './src/api/',
        };

        const pyshell = new PythonShell('sim.py', options);

        pyshell.stdin.write(JSON.stringify(wordsList));
        pyshell.stdin.end();

        pyshell.on('message', function (message) {
          try {
            let data = JSON.parse(message);
            if (typeof data === 'object' && data !== null) {
              var calculatedList = scores_dic.slice()
              for (const key in data) {
                const value = data[key];
                calculatedList = calculatedList.filter(obj => obj.sentence_id != key)
                calculatedList.push({
                  sentence_id: parseInt(key),
                  word1: value.word1,
                  word2: value.word2,
                  score: value.sim_score
                })
                sim_collection.insertOne(value)
                  .then(result => console.log(`Successfully inserted item with codes: ${value.word1} vs. ${value.word2} => ${value.sim_score}`))
                  .catch(err => console.error(`Failed to insert item: ${value.word1} vs. ${value.word2} => ${value.sim_score}`))
              }
              resolve(calculatedList)
            }
          } catch (error) {
            // console.log(error)
          }
        });

        pyshell.end(function (err) {
          if (err) {
            reject(err);
          }
        });
      }

    })
  })
}

const updateSimilarityInProjetcs = async (words_dict_sim, projects_coll, project_name, owner) => {
  // words_dict_sim = [{
  //   sentence_id: parseInt(key),
  //   word1: value.word1,
  //   word2: value.word2,
  //   score: value.sim_score
  // }...]
  const queryOption = { name: project_name, owner: owner };

  const promises = words_dict_sim.map(async (element) => {
    await projects_coll.updateOne(
      queryOption,
      {
        $set: {
          "segmented_data.$[sentence].similarity": { word1: element.word1, word2: element.word2, score: element.score },
        }
      }, {
      arrayFilters: [
        { "sentence.id": element.sentence_id },
      ],
      upsert: false
    }).then(result => console.log(`Successfully update: ${element.word1} ${element.word2} ${element.score}`))
  })

  Promise.all(promises)
}

// main function
const calculateSimilarities = async (segmented_data, codersToCompare, resPage, project_name, owner) => {
  const wordsList = [];

  const myDb = dbo.getDb()
  const sim_coll = myDb.collection(similarities_collection)
  const project_coll = myDb.collection(project_collection)

  for (const sentence of segmented_data) {
    const [word1, word2] = get_validated_words(sentence, codersToCompare)
    wordsList.push({
      sentence_id: sentence.id,
      word1: word1,
      word2: word2
    });
  }

  if (wordsList.length > 0) {
    const words_dict_sim = await calSim(wordsList, sim_coll)
    resPage.json(words_dict_sim)
    // update projects sim score
    updateSimilarityInProjetcs(words_dict_sim, project_coll, project_name, owner)
  }
};

statsRouter.route("/similarity").post(async function (req, res) {
  const segmented_data = req.body.segmented_data
  const codersToCompare = [req.body.coder0, req.body.coder1]
  const project_name = req.body.project_name
  const owner = req.body.owner
  await calculateSimilarities(segmented_data, codersToCompare, res, project_name, owner)
  res.end()
})


statsRouter.route("/ck").post(function (req, res) {
  let code_list_A = req.body.code1
  let code_list_B = req.body.code2
  let result = calcCohenKappa(code_list_A, code_list_B)

  res.json(result.toString());
  res.end()
});

module.exports = statsRouter;