const express = require('express');
const jwt = require('jsonwebtoken');


const secret = process.env.SECRET_KEY;

module.exports = authenticate = (req, res, next) => {
    // 获取token
    const token = req.headers.authorization;

    // token不存在
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // 验证token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            // 如果有误
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
    })
    next();
}