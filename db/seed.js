const client = require('./client');
const {addBook} = require('./')

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
            username VARCHAR(255) UNIQUE NOT NULL
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

async function populateItems() {
    console.log('Starting to populate books');

    const csv = require('csv-parser')
    const fs = require('file-system')
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    const books = [];

    fs.createReadStream('./db/goodreads_library_export.csv')
      .pipe(csv())
      .on('data', (data) => {
        books.push(data)})
      .on('end', () => {
          const bookPromises = books.map(elem => {
              console.log('*in the map');
              addBook({
                  title: elem.Title,
                  author: elem.Author,
                  description: lorem,
                  price: Math.floor(Math.random()*1001)+1,
                  year: Number(elem['Original Publication Year'])
              })
          })

        })
        Promise.all(bookPromises)
        console.log(bookPromises);
        


    console.log('Finished populating books');
}


async function rebuildDB(){
    try{
        client.connect();
        await dropTables()
        await createTables()
        await populateItems()
        

    } catch(error){
        console.error(error)
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...")

    } catch (error) {
        console.error(error);
        throw error;
    } 
}

rebuildDB()
.then(testDB())
.catch(console.error)
.finally(() => client.end());