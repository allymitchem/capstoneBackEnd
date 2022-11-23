const client = require('./client');

const { getAllUsers,createUser, getUserByUsername, getUser, getUserByUserId, updateUser} = require('./users')
const {addBook, getAllBooks, getBooksByAuthor, getBookByTitle, getBookById, updateBook} = require('./');





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
            price INTEGER NOT NULL,
            "numInStock" INTEGER NOT NULL
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
    const jane = await createUser({
        username: "JaneDoe",
        password: "doegirl",
        email: "janedoe@yahoo.com"
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
        year: 1950,
        numInStock: 8
    })
    await addBook({
        title: "green eggs and ham", 
        author: "dr. suess", 
        description: "test test test", 
        price: 800, 
        year: 1930,
        numInStock: 5
    })
    await addBook({
        title: "a different book", 
        author: "someone", 
        description: "test test test", 
        price: 800, 
        year: 1930, 
        numInStock: 3
    })
}





async function rebuildDB(){
    try{
        client.connect();
        await dropTables()
        await createTables()
        await populateItems()
        await createInitialUsers()
        

    } catch(error){
        console.error(error)
        throw error;
    }
}

const userInfo = {
    username: "Andrew Crow",
    password: "123456789",
    email: "glamgal@ymail.com"
}

const updatedUserInfo = {
    username: "allyson",
    password: "allygirl55",
    email: "allyson@gmail.com"
}

async function testDB() {
    try {
        console.log("Starting to test database...")

        const createdUser = await createUser(userInfo)
        console.log("create user", createdUser)

        const updatedUser = await updateUser(3, updatedUserInfo)
        console.log("updated user", updatedUser)

        const allUsers = await getAllUsers()
        console.log("all users", allUsers)

        const obtainUser = await getUser({username: "JohnDoe", password: "doeboy"})
        console.log("one user", obtainUser)

        const userByUsername = await getUserByUsername('JaneDoe')
        console.log("I am the username", userByUsername)

        const userByUserId = await getUserByUserId(3)
        console.log("user by ID", userByUserId)

        const allBooks = await getAllBooks()
        console.log("all books:",allBooks);
        
        const someBooks = await getBooksByAuthor("dr. suess")
        console.log("some books:",someBooks);
        
        const singleBook = await getBookByTitle('red fish blue fish')
        console.log("book titled red fish blue fish:",singleBook);

        const book3 = await getBookById(3)
        console.log("book number 3", book3);

        await updateBook({id: 3, author:"another guy"})
        const newBook3= await getBookById(3)
        console.log(newBook3, "this is updated book 3")

    } catch (error) {
        console.error(error);
        throw error;
    } 
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());