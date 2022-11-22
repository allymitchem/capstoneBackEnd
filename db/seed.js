const client = require('./client');
const {addBook, getAllBooks, getBooksByAuthor, getBookByTitle, getBookById} = require('./');
const { getAllUsers,createUser,updateUser} = require('./users')
const { fs } = require('file-system');
const csvParser = require('csv-parser');



async function dropTables() {
    try{
        console.log("Dropping All Tables...")

        await client.query(`
            DROP TABLE IF EXISTS cart_items;
            DROP TABLE IF EXISTS carts;
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS items;
        `)

        console.log("Finished Dropping All Tables...")
    }catch (error) {
        throw error;
    }
}

async function createTables(){
    try{
       console.log("Starting to build tables...")

       await client.query(`
        CREATE TABLE items(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            author VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            year INTEGER,
            price INTEGER NOT NULL
        );
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE carts(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id)
        );
        CREATE TABLE cart_items(
            id SERIAL PRIMARY KEY,
            "cartId" INTEGER REFERENCES carts(id),
            "itemId" INTEGER REFERENCES items(id),
            quantity INTEGER,
            UNIQUE ("cartId", "itemId")
        );
        `)

        console.log("Finished building tables!")
    }catch (error) {
        console.log("Error building tables!")
        throw error;
    }
}

async function createInitialUsers(){
    console.log("Starting to create initial user")
    try{
    const john = await createUser ({
        username: "JohnDoe",
        password: "doeboy",
        email: "johndoe@gmail.com"
    })
    console.log("Finished creating initial user!")
    } catch(error){
        console.error(error)
        throw error

    }
}

async function populateItems() {
    await addBook({
        title: "red fish blue fish", 
        author: "dr. suess", 
        description: "test test test", 
        price: 1000, 
        year: 1950
    })
    await addBook({
        title: "green eggs and ham", 
        author: "dr. suess", 
        description: "test test test", 
        price: 800, 
        year: 1930
    })
    await addBook({
        title: "a different book", 
        author: "someone", 
        description: "test test test", 
        price: 800, 
        year: 1930
    })
}
const books = [];

async function populateItemsfromCSV() {
    console.log('Starting to populate books');
    let stop = false
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const csv = require('csv-parser')
    const stream = fs.createReadStream('./db/goodreads_library_export.csv').pipe(csv())
      .on('data', async (data) => {
        books.push(data)
        })
      .on('finish', () => {console.log(performance.now(), console.log(books), "THE STREAM HAS ENDED")})
       const bookadded = await Promise.all(books.map((data)=> addBook({
            title: data.Title,
            author: data.Author,
            description: lorem,
            price: Math.floor(Math.random()*1001)+1,
            year: Number(data['Original Publication Year'])
    
        })))
    console.log(performance.now(),bookadded,'Finished populating books');
}


async function rebuildDB(){
    try{
        client.connect();
        await dropTables()
        await createTables()
        // await populateItemsfromCSV()
        await populateItems()
        await createInitialUsers()
        

    } catch(error){
        console.error(error)
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...")

        const allBooks = await getAllBooks()
        console.log("all books:",allBooks);
        
        const someBooks = await getBooksByAuthor("dr. suess")
        console.log("some books:",someBooks);
        
        const singleBook = await getBookByTitle('red fish blue fish')
        console.log("book titled red fish blue fish:",singleBook);

        const book3 = await getBookById(3)
        console.log("book number 3", book3);

    } catch (error) {
        console.error(error);
        throw error;
    } 
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());