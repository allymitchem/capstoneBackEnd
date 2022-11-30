const express = require('express')
const { getCart, addBooktoCart, deleteCartItem, getCartWithBooks, getCartByUser, getActiveCartByUser } = require('../db')
const cartItemsRouter = express.Router()
const {requireUser} = require("./utils")

// ADD BOOK TO CART

cartItemsRouter.post("/:cartId", async (req, res, next) => {
    const  {itemId, cartId, quantity} = req.body
    const id = req.params.cartId           
    
    try {
        const cart = await getCart(id)
        if(cart.userId == req.user.id) {
            const newCartItem = await addBooktoCart({itemId, cartId, quantity})
            console.log(newCartItem, "this is the book that was added")
            res.send(newCartItem)

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

cartItemsRouter.delete("/:cartItemId", async (req, res, next) => {
    const cartItemId = req.params.cartItemId
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










module.exports = cartItemsRouter