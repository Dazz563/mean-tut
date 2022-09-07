const path = require('path');
const express = require('express');
const cors = require('cors');

const postRoutes = require('./routes/posts.router');
const userRoutes = require('./routes/user.router');

const app = express();

// Setting cors
app.use(
    cors({
        origin: '*',
    })
);

// This will parse incoming JSON
app.use(express.json());

app.use('/images', express.static(path.join('images')));

// Router middleware
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
