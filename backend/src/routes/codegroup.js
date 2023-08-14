const express = require("express");
const gpt = require("../api/reqgpt")

const codeGroupRouter = express.Router();
const dbo = require("../db/Connection");

const generateCodeGroupPrompt = (codes) => {
    // codes: [code1, code2...]
    const promptHead = "Group the following codes into 5 groups according to their themes:\n\n"
    const requirement = "1. put codes under each group\n2. do not change the original codes\n3. name the group"
    const resultExample = "\n\nHere is the format of results: \nGroup1: [theme]\n1.[code]\n2.[code]\n3.[code]\n...\n"
    var formulatedcodes = ""
    codes.forEach((code, index) => {
        formulatedcodes += `${index + 1}: ${code}\n`
    })
    return promptHead + formulatedcodes + resultExample + requirement
}


const generateCodeGroups = async (codes) => {
    try {
        console.log("calling generateCodeGroups")
        let promptText = generateCodeGroupPrompt(codes)

        // get GPT response from chatGPT api
        const gptResponse = await gpt(promptText)
        const gptResponseObject = JSON.parse(gptResponse);

        const groupText = gptResponseObject.choices[0].message.content;
        const groups = groupText.split("\n\n").filter(Boolean);

        const codeRegex = /^\d+\.\s(.+)/;
        const groupData = groups.map((group) => {
            const [groupName, ...codes] = group.split("\n").filter(Boolean);
            const groupMembers = codes.map((code) => {
                const match = code.match(codeRegex);
                return match && match[1];
            }).filter(Boolean);
            return { groupName, groupMembers: groupMembers.map(e => e.trim()) };
        });

        console.log('groupData', groupData)
        return groupData;
    }
    catch (err) {
        console.log(err.response)
    }
}


codeGroupRouter.route("/").post(async function (req, res) {
    let owner = req.body.owner
    let project_name = req.body.project_name
    let codes = req.body.codes
    const queryOption = { name: project_name, owner: owner }

    // get codegroup response
    let generatedCodeGroups = await generateCodeGroups(codes)

    res.send(generatedCodeGroups)
    // add to database
    insertCodegroupsToDb(generatedCodeGroups, queryOption, res)
})

codeGroupRouter.route("/").put(async function (req, res) {
    // add to database
    let owner = req.body.owner
    let project_name = req.body.project_name
    let codeGroups = req.body.codeGroups
    const queryOption = { name: project_name, owner: owner }
    if (codeGroups) {
        insertCodegroupsToDb(codeGroups, queryOption, res)
    } else {
        console.error('codeGroupRouter response error', response)
    }
})


const insertCodegroupsToDb = async (generatedCodeGroups, queryOption, resPage) => {
    const collection = "projects"
    const coll = dbo.getDb().collection(collection);

    const set = {
        $set: { "CodeGroups": generatedCodeGroups }
    }
    const options = {
        upsert: true
    };
    coll.updateOne(queryOption, set, options).then(result => {
        console.log("Successfully update code")
        resPage.status(200)
        resPage.end()
    }).catch(err => {
        console.error(`Failed to update items: ${err}`)
        resPage.status(500)
        resPage.end()
    })
}


module.exports = codeGroupRouter;