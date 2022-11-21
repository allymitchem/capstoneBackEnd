const {client} = require('./client');

async function dropTables() {
    try{
        console.log("Dropping All Tables...")
        await client.query(`
            DROP TABLE IF EXISTS cart_item;
            DROP TABLE IF EXISTS cart;
            DROP TABLE IF EXISTS user;
            DROP TABLE IF EXISTS item;
        `)
    }catch (error) {
        throw error;
    }
}

async function createTables(){
    try{
       console.log("Starting to build tables...")

       await client.query(`
       CREATE TABLE item(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE NOT NULL,
        author VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        genre VARCHAR(255) NOT NULL,
        price INTEGER
       )
       ;`)

       await client.query(`
       CREATE TABLE user(
        id SERIAL PRIMARY KEY,
       )
       ;`)

       await client.query(`
       CREATE TABLE cart(
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES user(id)
       )
       ;`)

       await client.query(`
       CREATE TABLE cart_item(
        id SERIAL PRIMARY KEY,
        "cartId" INTEGER REFERENCES cart(id)
        "itemId" INTEGER REFERENCES item(id)
        quantity INTEGER
        UNIQUE ("cartId", "itemId")
       )
       ;`)

        console.log("Finished building tables!")
    }catch (error) {
        console.log("Error building tables!")
        throw error;
    }
}


async function rebuildDB(){
    try{
        client.connect();
        dropTables()
        createTables()
        

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