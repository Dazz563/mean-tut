const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const postRouter = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    },
});

postRouter.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId,
    });

    newPost
        .save()
        .then((createdPost) => {
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    ...createdPost,
                    id: createdPost._id,
                },
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Creating a post failed',
            });
        });
});

postRouter.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId,
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then((result) => {
            if (result.modifiedCount > 0) {
                res.status(200).json({
                    message: 'Update successful',
                });
            } else {
                res.status(401).json({
                    message: 'Not authorized!',
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Updating post failed!',
            });
        });
});

postRouter.get('', (req, res, next) => {
    // Pagination
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery
        .find()
        .then((documents) => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then((count) => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: fetchedPosts,
                maxPosts: count,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Fetching posts failed!',
            });
        });
});

postRouter.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'Post not found'});
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Fetching post failed!',
            });
        });
});

postRouter.delete('/:id', checkAuth, (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
        .then((result) => {
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: 'Delete successful',
                });
            } else {
                res.status(401).json({
                    message: 'Not authorized!',
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Delete post failed!',
            });
        });
});

module.exports = postRouter;
