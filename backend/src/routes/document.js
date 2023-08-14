const express = require("express");
var { query, insert } = require("../db/Utils")

const dbo = require("../db/Connection");

const documentRouter = express.Router();
const collection = "projects"

documentRouter.route("/:project").get(function (req, res) {
  let myDb = dbo.getDb();
  let filter = { name: req.params.project }
  query(myDb, collection, filter).then(value => {
    res.json(value[0].segmented_data)
    res.end()
  })
    .catch(err => {
      console.log(err)
      res.json([])
      res.end()
    })
});

documentRouter.route("/:project").post(function (req, res) {
  let myDb = dbo.getDb();
  let docs = req.body
  let filter = {}
  insert(myDb, collection, docs, filter).catch(console.log)
});

module.exports = documentRouter;