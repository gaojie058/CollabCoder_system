const express = require("express");
const dbo = require("../db/Connection");
const { insert,query } = require("../db/Utils");

const contactsRouter = express.Router();
const collection = "users" 

contactsRouter.route("/:user").get(function (req, res) {
  let myDb = dbo.getDb();
  let filter = { user_name: req.params.user } 
  query(myDb, collection, filter).then(value => {
    res.json(value[0])
    res.end()
  })
    .catch(err => {
      res.json([])
      res.end()
      console.log(err)
    })
});

contactsRouter.route("/").post(function (req) {
  let myDb = dbo.getDb();
  let docs = req.body 
  insert(myDb, collection, [docs])
    .catch(err => {
      console.log(err)
    })
});

module.exports = contactsRouter;