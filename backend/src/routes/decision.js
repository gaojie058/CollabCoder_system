const express = require("express");
const gpt = require("../api/reqgpt")

const decisionRouter = express.Router();
const dbo = require("../db/Connection");
const collection = "projects"


const generateDecisionPrompt = (code1, code2, interview_data) => {
    const promptHead = "There are two qualitative codes (Code1 and Code2) for the sentence, combine them and make a final version of codes based on the meaning of the sentence:\n\n"
    const resultExample = "\n\nHere is the format of results: \nVersion1:\nVersion2:\nVersion3:"
    const requirement = "Requirement:\n1.less and equal to 6 words\n2.no repeat words\n3.be general\n4.three different versions"
    return promptHead + "Code1:" + code1 + "\n" + "Code2:" + code2 + "\n" + "Sentence:" + interview_data + "\n\n" + requirement + resultExample
}

const generateDecisions = async (code1, code2, interview_data) => {
    try {
        console.log("calling generateOneSentenceDecision")
        let promptText = generateDecisionPrompt(code1, code2, interview_data)

        // get GPT response from chatGPT api
        const gptResponse = await gpt(promptText)
        const gptResponseObject = JSON.parse(gptResponse);

        const gptDecisions = gptResponseObject.choices[0].message.content;

        const gptDecisionsList = gptDecisions.split('\n').filter(function (decision) {
            return decision.trim() !== '';
        });

        return gptDecisionsList
    }
    catch (err) {
        console.log(err.response.statusText)
    }
}


decisionRouter.route("/").post(async function (req, res) {
    let response = await generateDecisions(req.body.code1, req.body.code2, req.body.interview_data)
    if (response) {
        res.send({ response: response })
    } else {
        console.error('decisionRouter response error', response)
    }
    res.end()
    return response
})

decisionRouter.route("/user").put(async function (req, res) {
    const owner = req.body.owner
    const project_name = req.body.project_name
    const newDecision = req.body.newDecision
    const userName = req.body.userName
    const row_id = newDecision.id
    const coll = dbo.getDb().collection(collection);
    const queryOption = { name: project_name, owner: owner };
    coll.updateOne(
        queryOption,
        {
            $set: {
                "segmented_data.$[sentence].decision":
                {
                    author: userName,
                    decision: newDecision.decision
                }
            }
        },
        {
            arrayFilters: [{ "sentence.id": row_id }],
            upsert: true
        })
        .then(() => {
            res.status(200)
            console.log(`Successfully insert ${newDecision.decision}`)
            res.end()
        })
        .catch(err => console.error(`Failed to insert items: ${err}`))
})

decisionRouter.route("/replaceone").put(async function (req, res) {
    const owner = req.body.owner
    const project_name = req.body.project_name
    const decision = req.body.decision
    const coders = req.body.coders
    const row_id = req.body.sen_idx
    const time = req.body.time
    const backup_codes = req.body.backup_codes

    const coll = dbo.getDb().collection(collection);
    const queryOption = { name: project_name, owner: owner };

    coll.updateOne(
        queryOption,
        {
            $set: {
                "segmented_data.$[sentence].codes.$[codeObj].code": decision,
                "segmented_data.$[sentence].codes.$[codeObj].time": time,
                "segmented_data.$[sentence].decision.backup_codes": backup_codes,
            }
        },
        {
            arrayFilters: [
                { "sentence.id": row_id },
                { "codeObj.author": { $in: coders } },
            ],
            upsert: true
        })
        .then(result => {
            res.status(200)
            console.log(`Successfully insert ${result.modifiedCount} decision:`)
            res.end()
        })
        .catch(err => console.error(`Failed to insert items: ${err}`))
})

decisionRouter.route("/undoone").put(async function (req, res) {
    const owner = req.body.owner
    const project_name = req.body.project_name
    const row_id = req.body.sen_idx
    const coders = req.body.coders

    const coll = dbo.getDb().collection(collection);
    const queryOption = { name: project_name, owner: owner };
    let backup_codes = []

    // query "segmented_data.$[sentence].decision.backup_codes"
    // replace "segmented_data.$[sentence].codes.$[codeObj].all" with queried, author 
    let doc = await coll.findOne(queryOption)
    backup_codes = doc.segmented_data.find(sen => sen.id == row_id).decision.backup_codes
    const promises = coders.map(coder => {
        let backup = backup_codes.find(obj => obj.author == coder)
        coll.updateOne(
            queryOption,
            {
                $set: {
                    "segmented_data.$[sentence].codes.$[codeObj]": backup,
                    "segmented_data.$[sentence].decision.backup_codes": [],
                }
            },
            {
                arrayFilters: [
                    { "sentence.id": row_id },
                    { "codeObj.author": coder },
                ],
                upsert: true
            })
            .then(result => {
                res.status(200)
                console.log(`Successfully insert ${result.modifiedCount} decision:`)
                res.end()
            })
            .catch(err => console.error(`Failed to insert items: ${err}`))
    })

    Promise.all(promises).then(console.log("Successfully undo one row."))
})

decisionRouter.route("/codebook").post(async function (req, res) {
    let owner = req.body.owner
    let userName = req.body.userName
    let project_name = req.body.project
    let oldDecision = req.body.oldDecision
    let newDecision = req.body.newDecision

    const coll = dbo.getDb().collection(collection);
    const queryOption = { name: project_name, owner: owner };

    coll.updateOne(
        queryOption,
        {
            $set: {
                "segmented_data.$[sentence].decision": { author: userName, decision: newDecision },
            }
        },
        {
            arrayFilters: [
                {
                    "sentence.decision.decision": oldDecision,
                },
            ],
            upsert: true
        })
        .then(result => {
            res.status(200)
            console.log(`Successfully update ${result.modifiedCount} decision:`)
            res.end()
        })
        .catch(err => console.error(`Failed to update items: ${err}`))
})

module.exports = decisionRouter;