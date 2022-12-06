const express = require("express")
const usersRouter = express.Router()
const jwt = require("jsonwebtoken")
const { JWT_SECRET}= process.env
const {getUserByUsername, getUser, createUser, getUserByEmail, getAllUsers, getUserByUserId, updateUser} = require("../db")
const {requireUser} = require("./utils")
const bcrypt = require("bcrypt")

usersRouter.use("",  (req, res, next) => {
    console.log("request had been made to users")
    next()
})

//need to create paths from users
// users/login, /register, /id, /admin
usersRouter.get("", requireUser, async  (req, res, next) => {
    try {
        if (req.user.id == 1){
            const allUsers = await getAllUsers()
            res.send(allUsers)
        }  else {
            next({
                name: "NotAuthorizedError",
                message: "You are not authorized to view this page"
            })
        }
    }catch(error){
        console.log(error)
        next(error)
    }
})

usersRouter.get("/me", requireUser, async (req, res, next) => {
    console.log('The users/me route was accessed');
    const user = await getUserByUserId(req.user.id)
    console.log(user)
    try{
        res.send(user)
    } catch ({name, message}) {
        next({name, message})
    }

})

usersRouter.patch("/me", requireUser, async  (req, res, next) => {
    const userId = req.user.id 
    console.log(userId, "this is user Id ")
    const fields = req.body
    console.log(fields, "this is fields")
    const SALT_COUNT = 12;
  const hashedPassword = await bcrypt.hash(fields.password, SALT_COUNT)
    const updatedObj = {
        username: fields.username,
        password: hashedPassword,
        email: fields.email,
        firstName: fields.firstName,
        lastName: fields.lastName,
        shippingAddress: fields.shippingAddress,
        cardNumber: fields.cardNumber,
        expiration: fields.expiration,
        billingAddress: fields.billingAddress
      };
    const updatedUser = await updateUser(userId, updatedObj)
    if (req.user.id == updatedUser.id){
        res.send(updatedUser)
    } else {
        next({
            error:"NotAuthorizedUser",
            message:"You are not authorized to update this user"
        })
    }
    

})

usersRouter.post("/login", async (req, res, next) => {
    const {username, password} = req.body
    if ( !username || !password){
        next({
            error: "MissingCredentialsError",
            message: "Please supply both a username and a password"
        })
    }
    try {
        console.log({username, password})
        const user = await getUser({username, password})

        if (user){
            const token = jwt.sign({id: user.id, username}, JWT_SECRET)
            res.send({ message: "You're logged in!", token, user})
        } else {
            next({
                error:"IncorrectCredentialsError",
                message:"Username or password is incorrect"          
            })
        }
    } catch(error){
        console.log(error)
        next(error)
    }
})     

usersRouter.post("/register", async (req, res, next) => {
        console.log("i am working")
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
        try { 
            const _user = await getUserByUsername(username)
            const _email = await getUserByEmail(email)
            console.log(_user, "this is the user object we are looking for")
            if (_user || _email){
                next({
                    name: "UserAlreadyExists",
                    message: `Either ${username} or ${email} is already in use.`
                })
            } else {
                const user = await createUser({username, password, email})
                // console.log(user, "user line 64")
                const  token = jwt.sign({id:user.id, username}, JWT_SECRET, {expiresIn: "2w"})
                res.send({message: "Thank you for signing up! Please login.", token, user})
            }

        } catch(error){
            console.log(error)
            next(error)
        }
    })
    





module.exports = usersRouter