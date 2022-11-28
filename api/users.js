const express = require("express")
const usersRouter = express.Router()
const jwt = require("jsonwebtoken")
const { JWT_SECRET}= process.env
const {getUserByUsername, getUser} = require("../db")

//need to create paths from users
// users/login, /register, /id, /admin

usersRouter.get("/login", async  (req, res, next) => {
    const {username, password} = req.body
 if ( !username || !password){
    next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and a password"
    })
 }
    try {
        const user = await getUser({username, password})

        if (user){
            const token = jwt.sign({id: user.id, username}, JWT_SECRET)
            res.send({ message: "You're logged in!", token, user})
        } else {
            next({
                name:"IncorrectCredentialsError",
                message:"Username or password is incorrect"          
            })
        }
    } catch(error){
        console.log(error)
        next(error)
    }
    
    usersRouter.post("/register", async (req, res, next) => {

        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            next({
                name: "MissingCredentialsError",
                message: "Please supply username, password and email"
            })
        }
        
        if (password.length < 8) {
            next({
              name: "PasswordLengthError",
              message: "Password Too Short!",
            });
          }

    })
})













module.exports = usersRouter