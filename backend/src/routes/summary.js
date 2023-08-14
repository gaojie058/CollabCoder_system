const express = require("express");
const gpt = require("../api/reqgpt")

const summaryRouter = express.Router();
const dbo = require("../db/Connection");

const generateSummaryPrompt = (sentence) => {
    const promptHead = "\n\nGenerate three versions of summarization for this text in short phrase (within 6 words):"
    return sentence + promptHead
}

const generateOneSentenceSummary = async (sentence) => {
    try {
        console.log("calling generateOneSentenceSummary")

        let promptText = generateSummaryPrompt(sentence)
        // get GPT response from chatGPT api
        const gptResponse = await gpt(promptText)
        const gptResponseObject = JSON.parse(gptResponse);
        const gptSummaries = gptResponseObject.choices[0].message.content;

        // get list without numbers
        const gptSummariesList = gptSummaries.split('\n')
            .filter(summary => summary.trim() !== '')
            .map(summary => summary.replace(/^\d+\.\s*/, ''));

        return gptSummariesList
    }
    catch (err) {
        console.log(err.response)
    }
}


const generateSimilarSummaryPrompt = (sentence, currentCodesList) => {
    // codes: [code1, code2...]
    const promptHead = "\n\nFind the most relevant three codes for this sentence from the following code list:\n\n"
    const resultExample = "\n\nHere is the example format of returned codes: \n1. code \n2. code\n3. code"
    var formulatedcodes = ""
    currentCodesList.forEach((code, index) => {
        formulatedcodes += `${index + 1}: ${code}\n`
    })
    return sentence + promptHead + formulatedcodes + resultExample
}


const generateSimilarSummaries = async (sentence, currentCodesList) => {
    try {
        console.log("calling generateSimilarSummaries")
        let promptText = generateSimilarSummaryPrompt(sentence, currentCodesList)
        // get GPT response from chatGPT api
        const gptResponse = await gpt(promptText)
        const gptResponseObject = JSON.parse(gptResponse);
        const gptSimilarCodes = gptResponseObject.choices[0].message.content;

        // get list without numbers
        const gptSimilarCodesList = gptSimilarCodes.split('\n')
            .filter(similarOne => similarOne.trim() !== '')
            .map(similarOne => similarOne.replace(/^\d+\.\s*/, ''));

        return gptSimilarCodesList
    }
    catch (err) {
        console.log(err.response)
    }
}


summaryRouter.route("/").post(async function (req, res) {
    let index = req.body.sen_idx
    let owner = req.body.owner
    let project_name = req.body.project_name
    let userName = req.body.userName
    let sentence = req.body.sentence
    let currentCodesList = req.body.currentCodesList

    const collection = "projects"
    const coll = dbo.getDb().collection(collection);
    const queryOption = { name: project_name, owner: owner }

    // get summary response
    let GPTsummaryResponse = await generateOneSentenceSummary(sentence)

    // get similar summaries
    let similarCodes = currentCodesList.length >= 3 ? await generateSimilarSummaries(sentence, currentCodesList) : currentCodesList

    response = {
        gptsummary: GPTsummaryResponse,
        similarCodes: similarCodes
    }

    // add to database
    if (response) {
        res.send({ index: index, response: response })
        inputAiSumToDb(response, index, coll, queryOption, userName)
    } else {
        console.error('summaryRouter response error', response)
    }
    res.end()
    return response
})


const inputAiSumToDb = async (summaries, sen_idx, coll, queryOption, userName) => {

    const set = {
        $set: {
            "segmented_data.$[sentenceObj].codes.$[codeObj].codeSuggestion": summaries
        }
    }
    const options = {
        arrayFilters: [
            { "sentenceObj.id": sen_idx },
            { "codeObj.author": userName }
        ],
        upsert: true
    };
    coll.updateOne(queryOption, set, options).then(result => {
        console.log("Successfully update code")
    }).catch(err => console.error(`Failed to update items: ${err}`))
}


module.exports = summaryRouter;