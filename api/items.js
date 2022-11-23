const express = require("express")
const itemsRouter = express.Router()
const {getAllBooks, getBookById, updateBook, addBook} = require('../db')

itemsRouter.get("", async (req, res, next) => {
  try {
    const itemList= await getAllBooks()
    res.send(itemList)
  } catch (error) {
    
  }
    
})


itemsRouter.get("/:itemId", async (req, res, next) => {
    
    try {
        const { itemId } = req.params
        const book = await getBookById(itemId)
        if(!book) {
            next({
                name: "Book Not Found",
                message: `A book with id ${itemId} not found.`
            })
        } else {
            res.send(book)
        }
        
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})

itemsRouter.post("", async (req, res, next) => {
    try {
        const {title, author, description, price, year, numInStock} = req.body 
        const addedBook = await addBook({title, author, description, price, year, numInStock})
        res.send(addedBook)
        
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})










module.exports = itemsRouter