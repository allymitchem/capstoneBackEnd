const express = require('express')
const { getCart, addBookToCart, deleteCartItem, getCartWithBooks, getCartsByUser, getActiveCartByUser, updateCartItem, getBookById } = require('../db')
const cartItemsRouter = express.Router()
const {requireUser} = require("./utils")

// ADD BOOK TO CART

cartItemsRouter.post("/:cartId", requireUser, async (req, res, next) => {
    const  {itemId, quantity} = req.body
    const {cartId} = req.params           
    
    try {
        const cart = await getCart(cartId)
        if(cart.userId == req.user.id) {
            const newCartItem = await addBookToCart({itemId, cartId, quantity})
            const itemInfo = await getBookById(newCartItem.itemId)
            delete itemInfo.id
            res.send({...newCartItem,...itemInfo})

        } else {
            next({
                name: "Unauthorized",
                message: `You can't add books to this cart.`
              })
            }
    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
    
} )

// DELETE AN ITEM FROM CART

cartItemsRouter.delete("/:cartItemId", requireUser, async (req, res, next) => {
    const {cartItemId} = req.params
    const userId = req.user.id

    try {
        const cart = await getActiveCartByUser(userId)

        if(cart.userId == req.user.id) {
            const cartItems = cart.items
            const book = cartItems.filter(item => item.id == cartItemId)
               if(book.length !== 0) {
                   const deletedBook = await deleteCartItem(cartItemId)
                   res.send(deletedBook)
               } else {
                next({
                    name: "Not Found",
                    message: `There is not item with that ID in cart.`
                  })
               }             
        } else {
            next({
                name: "Unauthorized",
                message: `You can't delete books from this cart.`
              })
            }
    } catch ({ error, name, message }) {
        next({ error, name, message })
    }

})

// UPDATE CART BY THE USER

cartItemsRouter.patch("/:cartItemId", requireUser, async (req, res, next) => {
    const {cartItemId} = req.params
    const userId = req.user.id
    const {quantity} = req.body

    try {
        const cart = await getActiveCartByUser(userId)
        if(cart.userId == req.user.id){
            const cartItems = cart.items
            const book = cartItems.filter(item => item.id == cartItemId)
               if(book.length !== 0){
                   const updatedCart = await updateCartItem({cartItemId, quantity})
                   res.send(updatedCart)
               } else {
                    next({
                        name: "Not Found",
                        message: `There is not item with that ID in cart.`
                     })
                }
        } else {
            next({
                name: "Unauthorized",
                message: `You can't update books in this cart.`
              })
            }
    } catch ({ error, name, message }) {
        next({ error, name, message })
    }
})

module.exports = cartItemsRouter