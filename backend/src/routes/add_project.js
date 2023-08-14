const express = require("express");
const { split_into_sentences, split_into_paragraphs } = require("../api/parsenew");
const { split_into_cells } = require("../api/parsecsv")

const addprojectRouter = express.Router();
const dbo = require("../db/Connection");
const { insert } = require("../db/Utils");
const fs = require('fs');

addprojectRouter.route('/').post(async (req, res) => {
  let db_connect = dbo.getDb();
  let myobj = req.body
  let codingLevel = req.body.coding_level
  let text = req.body.input_docs
  let collaborators = req.body.coders
  let filename = req.body.file_names

  //parse sentences
  let segmented_data = [];

  if (filename.endsWith('.csv')) {
    const cells = await split_into_cells(text);
    const csvText = cells.join('\n\n');
    segmented_data = codingLevel === 'Sentence' ? split_into_sentences(csvText)
      : codingLevel === 'Paragraph' ? split_into_paragraphs(csvText)
        : [];
  } else if (filename.endsWith('.txt')) {
    segmented_data = codingLevel === 'Sentence' ? split_into_sentences(text)
      : codingLevel === 'Paragraph' ? split_into_paragraphs(text)
        : [];
  }


  if (segmented_data) {

    myobj["segmented_data"] = segmented_data.map((interview, index) => {
      let interview_data = interview.trim()
      if (interview_data != "" && interview_data.length > 0) {
        return (
          {
            id: index,
            interview_data: interview_data,
            codes: collaborators.map((coder, idx) => ({
              id: idx,
              author: coder.name,
              code: "",
              uncertainty: 5
            })),
            keywords: collaborators.map(coder => ({
              author: coder.name,
              keywords: []
            }))
          }
        )
      }
    }).filter(data => data != undefined && data != null)
    insert(db_connect, "projects", [myobj])
      .catch(console.log)
  }
});

addprojectRouter.route('/example').post(async (req, res) => {
  let db_connect = dbo.getDb();
  let user_name = req.body.userName
  let project_name = req.body.projectName

  const fileData = fs.readFileSync('./src/routes/example.json', "utf-8");
  let userReplaced = fileData.replaceAll("****", user_name)
  let modifiedObj = JSON.parse(userReplaced)
  modifiedObj.name = project_name

  insert(db_connect, "projects", [modifiedObj])
    .then(res.status(200).end())
    .catch(console.log)
}
);

module.exports = addprojectRouter;