const express = require('express')
const cartsRouter = express.Router()
const {getActiveCarts, getCartsByUser, getCart, updateCart, createCart, deleteCart, getActiveCartByUser} = require("../db")
const {requireUser} = require("./utils")

cartsRouter.get("/", requireUser, async (req, res, next) => {
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

cartsRouter.get('/:userId/all', requireUser, async (req, res, next) => {
    const { userId } = req.params
    console.log(req.user.id, "is this the req user id?")
    try {
        if(req.user.id == userId || req.user.id == 1){
            const userCart = await getCartsByUser(userId)
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

cartsRouter.get('/:userId', requireUser, async (req, res, next) => {
    const { userId } = req.params

    try {
        if(req.user.id == userId || req.user.id == 1){
            const userCart = await getActiveCartByUser(userId)
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

cartsRouter.post("", requireUser, async (req, res, next) => {
    const userCarts = await getCartsByUser(req.user.id)
    const activeCart = userCarts.find((elem) => elem.active === true)
    console.log(activeCart);
    if (activeCart) {
        next({
            name: "ExistingUserCart",
            message: `This user already has an active cart.`
          })
    } else {
        const newCart = await createCart(req.user.id)
    }
})


cartsRouter.patch('/:cartId', requireUser, async (req, res, next) => {
    const {cartId} = req.params
    const fields = req.body
    if(JSON.stringify(fields) !== JSON.stringify({active: null})) {
        next({
            name: "WrongBody",
            message: "the body of the request must contain active"
        })
    }
    try {
        const existingCart = await getCart(cartId)
        if(req.user.id == existingCart.userId || req.user.id == 1){
            const newCart = await updateCart({cartId, ...fields})
            res.send(newCart);
        } else {
            next({
                name: "UnauthorizedUser",
                message: `You are not authorized to update this cart`
              })
        }
    } catch ({ error, name, message }) {
        next({ error, name, message })
    }  
})

cartsRouter.delete('/:cartId', requireUser, async (req, res, next) => {
    const { cartId } = req.params
    try {
        const existingCart = await getCart(cartId)
        console.log(existingCart);
        if (existingCart) {
            if(req.user.id == 1){
                const trashCart = await deleteCart(cartId)
                res.send(trashCart)
            } else {
                next({
                    name: "UnauthorizedUser",
                    message: `Not authorized.`
                })
            }
        } else {
            next({
                name: "NoCart",
                message: `No cart with that ID exists`
            })
        }

    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
})

module.exports = cartsRouter