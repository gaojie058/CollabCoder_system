const express = require('express');
const jwt = require('jsonwebtoken');
const autoLoginRouter = express.Router();


autoLoginRouter.get('/', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        // 验证token是否有效
        // 如果有效，返回用户信息
        // 如果无效，返回错误信息
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
            }
            else {
                res.json({ message: 'success', username: decoded.user_name });
            }
        })
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
})

module.exports = autoLoginRouter