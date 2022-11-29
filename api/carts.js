const express = require('express')
const cartsRouter = express.Router()
const {getActiveCarts, getCartByUser} = require("../db")
const {requireUser} = require("./utils")

cartsRouter.get("/", async (req, res, next) => {
    try {
      if (req.user.id === 1) {
          const activeCarts = await getActiveCarts()
          res.send(activeCarts)
      } else {
        next({
          name: "UnauthorizedUser",
          message: `Only an Administrator can view carts.`
        })
      }
    } catch ({ error, name, message }) {
      next({ error, name, message })
    }
  })

  cartsRouter.get('/:userId', requireUser, async (req, res, next) => {
    const { userId } = req.params
    console.log(req.user.id, "is this the req user id?")
    try {
        if(req.user.id == userId){
            const userCart = await getCartByUser(userId)
            res.send(userCart)
        } else {
            next({
                name: "UnauthorizedUser",
                message: `Not authorized.`
              })
        }
    } catch ({ error, name, message }) {
        next({ error, name, message })
      }
  })

module.exports = cartsRouter