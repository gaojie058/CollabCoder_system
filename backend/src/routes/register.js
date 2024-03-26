const express = require("express");
const { createHash } = require('crypto');
const dbo = require("../db/Connection");
const { query, insert } = require("../db/Utils");
const jwt = require("jsonwebtoken");

console.log();
function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

const registerRouter = express.Router();
const collection = "users"

registerRouter.post("/", function (req, res) {
  let myDb = dbo.getDb();
  let emailFilter = { email: req.body.email }
  let userNameFilter = { user_name: req.body.user_name }

  query(myDb, collection, emailFilter).then(value => {
    if (value.length > 0) {
      // user exists, show error
      return res.json({ status: 'error', error: 'Email is already registered.' })
    } else {
      query(myDb, collection, userNameFilter).then(value2 => {
        if (value2.length > 0) {
          // user exists, show error
          return res.json({ status: 'error', error: 'Username is already registered.' })
        } else {
          let user = {
            user_name: req.body.user_name,
            password_sha256_encrypted: hash(req.body.password),
            email: req.body.email,
            projects: [],
          }
          insert(myDb, collection, [user])
            .then(() => {
              // 生成token
              const token = jwt.sign({ user_name: user.user_name }, process.env.SECRET_KEY, { expiresIn: '30days' });

              return res.json({ status: 'success', token })
            }
            )
            .catch(console.log)
        }
      })
    }
  })
});

// todo: delete all codes of the user as well
// 加权限控制
registerRouter.route("/").delete(async function (req, res) {
  let filter = { user_name: req.body.user_name }
  const coll = dbo.getDb().collection(collection);
  coll.deleteOne(filter)
    .then(result => {
      res.sendStatus(200)
      console.log(`Deleted ${result.deletedCount} item.`)
    })
    .catch(err => {
      res.status(404).send(err);
      console.error(`Delete failed with error: ${err}`)
    })
});

module.exports = registerRouter;
