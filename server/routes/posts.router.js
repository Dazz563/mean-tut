const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const {createPost, updatePost, getPosts, getPost, deletePost} = require('../controllers/posts.controller');

const postRouter = express.Router();

postRouter.post('', checkAuth, extractFile, createPost);
postRouter.put('/:id', checkAuth, extractFile, updatePost);
postRouter.get('', getPosts);
postRouter.get('/:id', getPost);
postRouter.delete('/:id', checkAuth, deletePost);

module.exports = postRouter;
