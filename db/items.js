const client = require('./client');

async function addBook({title, author, description, price, year}) {
    try {
        const {rows: [book]} = await client.query(`
            INSERT INTO items(title, author, description, year, price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [title, author, description, year, price])
        return book
    } catch (error) {
        console.error(error)
    }
}

async function deleteBook(idNum) {
    try {
        //before we delete a book we need to check that it is gone from carts
        const {rows: [book]} = await client.query(`
            DELETE FROM items
            WHERE id = $1
            RETURNING *
        ;`, [idNum])
        return book
    } catch (error) {
        console.error(error)
    }
}

async function getAllBooks() {
    try {
        const {rows: books} = await client.query(`
            SELECT * 
            FROM items
        ;`)
        return books

    } catch (error) {
        console.error(error)
    }
}

async function getBookById(idNum) {
    try {
        const {rows: [books]} = await client.query(`
        SELECT * FROM items
        WHERE id = $1;
        `,[idNum])
        return books
    } catch (error) {
        console.log(error)
    }
}

async function getBooksByAuthor(authorName) {
    try {
        const {rows: books} = await client.query(`
        SELECT * FROM items
        WHERE author = $1;
        `,[authorName])
        return books
    } catch (error) {
        console.log(error)
    }
}

async function getBookByTitle(title) {
    try {
        const {rows: [books]} = await client.query(`
        SELECT * FROM items
        WHERE title = $1;
        `,[title])
        return books
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    addBook,
    deleteBook,
    getAllBooks,
    getBookById,
    getBooksByAuthor,
    getBookByTitle
};