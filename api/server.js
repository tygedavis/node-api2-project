const express = require('express');

const router = require('../api/post-router.js');

const server = express();

server.use(express.json());

server.use('/api/posts', router);

module.exports = server;