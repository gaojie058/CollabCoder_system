const express = require("express");
var { query, insert } = require("../db/Utils")

const dbo = require("../db/Connection");

const projectsRouter = express.Router();
const collection = "projects"

projectsRouter.route("/:user").get(function (req, res) {
  let myDb = dbo.getDb();
  let filter = { coders: { $elemMatch: { name: req.params.user } } }
  query(myDb, collection, filter).then(value => {
    res.json(value)
    res.end()
  })
    .catch(err => {
      res.json([])
      res.end()
      console.log(err)
    })
});

module.exports = projectsRouter;