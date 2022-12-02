const express = require("express")
const itemsRouter = express.Router()
const {requireUser} = require("./utils")

const { getAllBooks, getBookById, updateBook, addBook, deleteBook } = require('../db')

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

itemsRouter.post("", requireUser ,async (req, res, next) => {
    try {
        if (req.user.id == 1) {
            const {title, author, description, price, year, numInStock, imageURL} = req.body 
            const addedBook = await addBook({title, author, description, price, year, numInStock, imageURL})
            res.send(addedBook)
        } else {
            next({
                name: "UnauthorizedUser",
                message: `Only an Administrator can add books.`
            })
        }        
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})

itemsRouter.delete("/:itemId", requireUser, async (req, res, next) => {
    const { itemId } = req.params
    try {
        if (req.user.id == 1) { 
            const book = await getBookById(itemId)
            if(!book) {
                next({
                    name: "Book Not Found",
                    message: `A book with id ${itemId} not found.`
                })
            } else {
                const deletedBook = await deleteBook(itemId)
                res.send(deletedBook)
            }
        } else {
            next({
                name: "UnauthorizedUser",
                message: `Only an Administrator can delete books.`
            })
        }    
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})

//better error handling here
itemsRouter.patch("/:itemId", requireUser, async (req, res, next) => {
    const { itemId } = req.params
    const fields = req.body
    try {
        const book = await getBookById(itemId)
        if(!book) {
            next({
                name: "Book Not Found",
                message: `A book with id ${itemId} not found.`
            })
        } else {
            if (req.user.id == 1) { 
                const updatedBook = await updateBook({id: itemId, ...fields})
                res.send(updatedBook)
            } else if (JSON.stringify(Object.keys(fields)) === JSON.stringify(["numInStock"])) {
                const updatedBook = await updateBook({id: itemId, ...fields})
                res.send(updatedBook)
            } else {
                next({
                    name: "UnauthorizedUser",
                    message: `Only an Administrator can Update book information.`
                })
            }  
        }
    } catch ({error, name, message}) {
        next({error, name, message})
    }
})


module.exports = itemsRouter