const express = require('express');

const projectRouter = require('./routers/projectRouter.js');

const server = express();

server.use(express.json());

server.use('/api/projects', logger, projectRouter);

server.use(logger);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
  });

  function logger(req, res, next) {
    console.log(`${req.method} Request to: ${req.originalUrl} at ${Date.now()}`);
    next();
  };

  module.exports = server;