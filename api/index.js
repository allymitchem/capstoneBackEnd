const express = require('express')
const apiRouter = express.Router();
// need to import their version of getuserbyId


const jwt = require('jsonwebtoken');
const {getUserById} = require('../db');
const {JWT_SECRET} = process.env;

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer '
    const auth = req.header('Authorization')

    if(!auth) {
        next();
    }else if (auth.startsWith(prefix)){
        const token = auth.slice(prefix.length);

        try {
            const {id} = jwt.verify(token, JWT_SECRET);

            if(id) {
                // may have to change this to adapt to other user function
                req.user = await getUserById(id)
                next();
            }
        } catch ({error, name, message}) {
            next({error, name, message});
            
        }
    } else {
        next({
            name: "AuthorizationHeaderError",
            message: "Authorization token must start with Bearer"
        })
    }
})

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