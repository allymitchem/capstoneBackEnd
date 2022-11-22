const client = require('./client');

async function addBook({title, author, description, price, year}) {
    try {
        console.log('**in the function call',{title, author,description,price,year});
        const {rows: [book]} = await client.query(`
            INSERT INTO items(title, author, description, year, price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `,[title, author, description, year, price])
        console.log('***after the insert',book);
        return book
    } catch (error) {
        console.error(error)
    }
}

async function getAllBooks() {
    const {rows: books} = await client.query(`
        SELECT * 
        FROM items
    ;`)
    return books
}

module.exports = {addBook};