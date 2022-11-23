const express = require('express')
const apiRouter = express.Router();


const jwt = require('jsonwebtoken');
const {getUserById} = require('../db');
const {JWT_SECRET} = process.env;

// console.log(JWT_SECRET);

apiRouter.use((error, req, res, next)=> {
    res.send({  
        name: error.name,
        message: error.message
    })
})

const itemsRouter = require('./items')
apiRouter.use('/items', itemsRouter)

const usersRouter = require ('./users')
apiRouter.use('/users', usersRouter)

module.exports = apiRouter;