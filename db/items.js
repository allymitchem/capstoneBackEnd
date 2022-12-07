const client = require('./client');

async function addBook({title, author, description, genre, price, year, numInStock, imageURL}) {
    try {
        const {rows: [book]} = await client.query(`
            INSERT INTO items(title, author, description, genre, year, price, "numInStock", "imageURL")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `, [title, author, description, genre, year, price, numInStock, imageURL])
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
        console.error(error)
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
        console.error(error)
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
        console.error(error)
    }
}

async function updateBook({id, ...fields}) {
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');
    try {
        const {rows: [book]} = await client.query(`
        UPDATE items
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(fields));
        return book
    } catch (error) {
        console.error(error)        
    } 
}



module.exports = {
    addBook,
    deleteBook,
    getAllBooks,
    getBookById,
    getBooksByAuthor,
    getBookByTitle,
    updateBook
};