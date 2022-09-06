const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const user = require('../models/user');

const userRouter = express.Router();

userRouter.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then((result) => {
                res.status(201).json({
                    message: 'User created',
                    result: result,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                });
            });
    });
});

userRouter.post('/login', (req, res, next) => {
    // Check user exists with email
    User.findOne({email: req.body.email})
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed',
                });
            }
            // Check password is legit
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed',
                });
            }
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1h',
                }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: 'Auth failed',
            });
        });
    // hello
});

module.exports = userRouter;
