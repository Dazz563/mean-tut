const express = require('express');
const {createUser, userLogin} = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.post('/signup', createUser);
userRouter.post('/login', userLogin);

module.exports = userRouter;
