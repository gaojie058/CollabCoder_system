const express = require("express");
var query = require("../db/Utils").query
const dbo = require("../db/Connection");
const jwt = require('jsonwebtoken');

const loginRouter = express.Router();
const collection = "users"

loginRouter.route("/").post(function (req, res) {
	let myDb = dbo.getDb();
	let filter = { email: req.body.email }
	console.log(1);
	query(myDb, collection, filter).then(value => {
		if (value.length == 0) {
			res.json({ message: 'User does not exsit', user: null, })
		} else {
			let stored_pw = value[0].password_sha256_encrypted
			let hashed_pw = req.body.password
			const isPasswordValid = (hashed_pw == stored_pw)
			if (isPasswordValid) {
				// 生成token
				const token = jwt.sign({ user_name: value[0].user_name }, process.env.SECRET_KEY, { expiresIn: '30days' });
				res.json({ message: "Success", user: value[0].user_name, token })
			} else {
				res.json({ message: "Wrong password", user: value[0].user_name })
			}
		}
		res.end()
	})
})

module.exports = loginRouter;