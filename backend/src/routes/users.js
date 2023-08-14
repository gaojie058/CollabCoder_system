const express = require("express");
const dbo = require("../db/Connection");
const { query } = require("../db/Utils");

const usersRouter = express.Router();
const collection = "users" 

usersRouter.route("/").get(function (req, res) {
    let myDb = dbo.getDb();
    let filter = {}
    query(myDb, collection, filter).then(userList => {
        res.json(userList.map((userData) => ({ user_name: userData.user_name, email: userData.email })))
        res.end()
    })
        .catch(err => {
            res.json([])
            res.end()
            console.log(err)
        })
});

module.exports = usersRouter;