require('dotenv').config();


const { PORT = 3000 } = process.env
const express = require('express');
const server = express();

const morgan = require('morgan');
server.use(morgan('dev'));
server.use(express.json())

const cors = require("cors");
server.use(cors());

server.use((req, res, next) => {
    console.log('<___Body Logger START___>');
    console.log(req.body);
    console.log('<___Body Logger END___>');

    next();
})

const apiRouter = require("./api");
server.use('/api', apiRouter);

server.use("*", (req, res)=> {
    res.status(404).send({
        error: "404 not found",
        message: "no route found for the requested url"
    })

})

server.use((error, req, res, next) => {
    if (res.statusCode < 400) {
        res.status(500)
    }
    res.send({
        error: error.error,
        name: error.name,
        message: error.message
    })
})

const client = require('./db/client');

client.connect();

server.listen(PORT, () => {
    console.log('The server is up and listening on port:', PORT);
})