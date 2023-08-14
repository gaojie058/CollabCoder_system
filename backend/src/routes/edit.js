const express = require("express");
const { query } = require("../db/Utils");
const dbo = require("../db/Connection");

const editRouter = express.Router();
const collection = "projects"

editRouter.route("/").post(function (req, res) {

    const coll = dbo.getDb().collection(collection);
    let owner = req.body.owner
    let userName = req.body.userName
    let project_name = req.body.project
    let row_id = req.body.row_id
    let code = req.body.code
    let code_source = req.body.selectedFromAuthor
    let time = req.body.time
    let uncertainty = req.body.uncertainty

    const queryOption = { name: project_name, owner: owner };

    //check codes exist
    query(dbo.getDb(), collection, queryOption).then(documents => {
        if (documents[0].segmented_data[row_id].codes.filter(obj => obj.author == userName).length == 0) {
            // insert
            coll.updateOne(
                queryOption,
                {
                    $push: {
                        "segmented_data.$[sentence].codes": { author: userName, code: code, code_source: code_source, time: time, uncertainty: uncertainty }
                    }
                },
                {
                    arrayFilters: [{ "sentence.id": row_id }],
                    upsert: true
                })
                .then(result => {
                    console.log("Successfully insert code:" + result)
                    return res.json(result)
                })
                .catch(err => console.error(`Failed to insert items: ${err}`))
        } else {

            const existingCodeSource = documents[0].segmented_data[row_id].codes.find(obj => obj.author == userName).code_source;

            let update = {
                $set: {
                    "segmented_data.$[sentence].codes.$[codeObj]": { author: userName, code: code, time: time, uncertainty: uncertainty },
                },
            };

            if (code_source !== null) {
                update.$set["segmented_data.$[sentence].codes.$[codeObj]"].code_source = code_source;
            } else {
                update.$set["segmented_data.$[sentence].codes.$[codeObj]"].code_source = existingCodeSource;
            }

            const options = {
                arrayFilters: [
                    { "sentence.id": row_id },
                    { "codeObj.author": userName }
                ],
                upsert: true
            };

            coll.updateOne(queryOption, update, options)
                .then(result => {
                    console.log("Successfully update: " + result.modifiedCount + " code")
                    return res.json(result)
                })
                .catch(err => console.error(`Failed to update items: ${err}`))
        }
    }).catch(console.log)
});

editRouter.route("/codebook").post(function (req, res) {
    const coll = dbo.getDb().collection(collection);
    let owner = req.body.owner
    let userName = req.body.userName
    let project_name = req.body.project
    let oldCode = req.body.oldCode
    let newCode = req.body.newCode
    let arrayFilters
    if (Array.isArray(userName)) {
        arrayFilters = [{ "codeObj.code": oldCode, "codeObj.author": { $in: userName.map(it => it.name) } }]
    } else {
        arrayFilters = [{ "codeObj.code": oldCode, "codeObj.author": userName }]
    }

    const queryOption = { name: project_name, owner: owner };

    const update = {
        $set: { "segmented_data.$[].codes.$[codeObj].code": newCode }
    };
    const options = {
        arrayFilters: arrayFilters,
        upsert: true
    };

    coll.updateOne(queryOption, update, options)
        .then(result => {
            console.log("Successfully update code")
            return res.json(result)
        })
        .catch(err => console.error(`Failed to update items: ${err}`))

});

editRouter.route("/uncertainty").post(function (req, res) {
    const coll = dbo.getDb().collection(collection);
    let owner = req.body.owner
    let userName = req.body.userName
    let project_name = req.body.project
    let row_id = req.body.row_id
    let uncertainty = req.body.uncertainty

    const queryOption = { name: project_name, owner: owner };

    //check codes exist
    query(dbo.getDb(), collection, queryOption).then(() => {

        const update = {
            $set: { "segmented_data.$[sentence].codes.$[codeObj].uncertainty": uncertainty }
        };
        const options = {
            arrayFilters: [
                { "sentence.id": row_id },
                { "codeObj.author": userName }
            ],
            upsert: true
        };

        coll.updateOne(queryOption, update, options)
            .then(result => {
                console.log("Successfully update :" + result.modifiedCount + " uncertainty")
                return res.json(result)
            })
            .catch(err => console.error(`Failed to update items: ${err}`))
    });
});

editRouter.route("/keyword").post(function (req, res) {
    const coll = dbo.getDb().collection(collection);
    let owner = req.body.owner
    let userName = req.body.userName
    let project_name = req.body.project
    let row_id = req.body.rowId
    let keyword = req.body.keyword

    const queryOption = { name: project_name, owner: owner };

    //check codes exist
    query(dbo.getDb(), collection, queryOption).then(() => {

        const update = {
            $push: { "segmented_data.$[sentence].keywords.$[keywordsObj].keywords": keyword }
        };
        const options = {
            arrayFilters: [
                { "sentence.id": row_id },
                { "keywordsObj.author": userName }
            ],
            upsert: true
        };

        coll.updateOne(queryOption, update, options)
            .then(result => {
                console.log("Successfully update :" + result.modifiedCount + " keyword")
                return res.json(result)
            })
            .catch(err => console.error(`Failed to update items: ${err}`))
    });
});

editRouter.route("/keyword").delete(function (req, res) {
    const coll = dbo.getDb().collection(collection);
    let owner = req.body.owner
    let userName = req.body.userName
    let project_name = req.body.project
    let row_id = req.body.rowId
    let keyword = req.body.keyword

    const queryOption = { name: project_name, owner: owner };

    //check codes exist
    query(dbo.getDb(), collection, queryOption).then(() => {

        const update = {
            $pull: { "segmented_data.$[sentence].keywords.$[keywordsObj].keywords": keyword }
        };
        const options = {
            arrayFilters: [
                { "sentence.id": row_id },
                { "keywordsObj.author": userName }
            ],
            upsert: true
        };

        coll.updateOne(queryOption, update, options)
            .then(result => {
                console.log("Successfully update :" + result.modifiedCount + " keyword")
                return res.json(result)
            })
            .catch(err => console.error(`Failed to update items: ${err}`))
    });
});

module.exports = editRouter;