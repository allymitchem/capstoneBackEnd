const client = require('./client');

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
            genre VARCHAR(255) NOT NULL,
            price INTEGER
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


async function rebuildDB(){
    try{
        client.connect();
        await dropTables()
        await createTables()
        

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
.then(testDB)
.catch(console.error)
.finally(() => client.end());