const client = require('./client');
const {addBook, getAllBooks, getBooksByAuthor, getBookByTitle, getBookById, updateBook, createCart, addBooktoCart, getBooksInCart, getCart, getCartWithBooks, deleteCartItem, deleteCart, updateCart, updateCartItem, getActiveCarts} = require('./');
const { getAllUsers,createUser, getUserByUsername, getUser, getUserByUserId, updateUser, getUserByEmail} = require('./users')




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
            "imageURL" VARCHAR(255),
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
            "userId" INTEGER REFERENCES users(id),
            active BOOLEAN DEFAULT true
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
        title: "Pride and Prejudice", 
        author: "Jane Austen", 
        description: "The romantic clash between the opinionated Elizabeth and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring. And Jane Austen's radiant wit sparkles as her characters dance a delicate quadrille of flirtation and intrigue, making this book the most superb comedy of manners of Regency England.", 
        price: 2000, 
        year: 1813,
        numInStock: 8,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669606944/books/PrideAndPrejudice.jpg"
    })    
    await addBook({
        title: "1984", 
        author: "George Orwell", 
        description: "The scene is London, where there has been no new housing since 1950 and where the city-wide slums are called Victory Mansions. Science has abandoned Man for the State. As every citizen knows only too well, war is peace.", 
        price: 2100, 
        year: 1949,
        numInStock: 5,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669606962/books/1984.jpg"
    })   
    await addBook({
        title: "To Kill A Mockingbird", 
        author: "Harper Lee", 
        description: "Compassionate, dramatic, and deeply moving, 'To Kill A Mockingbird' takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos.", 
        price: 1800, 
        year: 1960,
        numInStock: 6,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669606970/books/ToKillAMockingbird.jpg"
    })
    await addBook({
        title: "The Great Gatsby", 
        author: "F. Scott Fitzgerald", 
        description: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted 'gin was the national drink and sex the national obsession,' it is an exquisitely crafted tale of America in the 1920s.", 
        price: 1900, 
        year: 1925,
        numInStock: 9,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607223/books/TheGreatGatsby.jpg"
    })
    await addBook({
        title: "The Catcher in the Rye", 
        author: "J.D. Salinger", 
        description: "The Catcher in the Rye is an all-time classic in coming-of-age literature- an elegy to teenage alienation, capturing the deeply human need for connection and the bewildering sense of loss as we leave childhood behind.", 
        price: 2200, 
        year: 1951,
        numInStock: 10,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607210/books/theCatcherInTheRye.jpg"
    })
    await addBook({
        title: "Catch-22", 
        author: "Joseph Heller", 
        description: "Set in Italy during World War II, this is the story of the incomparable, malingering bombardier, Yossarian, a hero who is furious because thousands of people he has never met are trying to kill him. But his real problem is not the enemy—it is his own army, which keeps increasing the number of missions the men must fly to complete their service. Yet if Yossarian makes any attempt to excuse himself from the perilous missions he’s assigned, he’ll be in violation of Catch-22, a hilariously sinister bureaucratic rule: a man is considered insane if he willingly continues to fly dangerous combat missions, but if he makes a formal request to be removed from duty, he is proven sane and therefore ineligible to be relieved.", 
        price: 1500, 
        year: 1961,
        numInStock: 5,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607195/books/catch-22.jpg"
    })
    await addBook({
        title: "Jane Eyre", 
        author: "Charlotte Bronte", 
        description: "Orphaned as a child, Jane has felt an outcast her whole young life. Her courage is tested once again when she arrives at Thornfield Hall, where she has been hired by the brooding, proud Edward Rochester to care for his ward Adèle. Jane finds herself drawn to his troubled yet kind spirit. She falls in love. Hard.", 
        price: 2200, 
        year: 1847,
        numInStock: 12,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607090/books/JaneEyre.jpg"
    })
    await addBook({
        title: "Great Expectations", 
        author: "Charles Dickens", 
        description: "In what may be Dickens's best novel, humble, orphaned Pip is apprenticed to the dirty work of the forge but dares to dream of becoming a gentleman — and one day, under sudden and enigmatic circumstances, he finds himself in possession of 'great expectations'.", 
        price: 1500, 
        year: 1860,
        numInStock: 7,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607099/books/GreatExpectations.jpg"
    })
    await addBook({
        title: "Wuthering Heights", 
        author: "Emily Bronte", 
        description: "At the centre of this novel is the passionate love between Catherine Earnshaw and Heathcliff - recounted with such emotional intensity that a plain tale of the Yorkshire moors acquires the depth and simplicity of ancient tragedy.", 
        price: 2200, 
        year: 1847,
        numInStock: 12,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607111/books/WutheringHeights.jpg"
    })
    await addBook({
        title: "Little Women", 
        author: "Louisa May Alcott", 
        description: "Here are talented tomboy and author-to-be Jo, tragically frail Beth, beautiful Meg, and romantic, spoiled Amy, united in their devotion to each other and their struggles to survive in New England during the Civil War.", 
        price: 2200, 
        year: 1868,
        numInStock: 15,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669607149/books/LittleWomen.jpg"
    })
    await addBook({
        title: "Animal Farm", 
        author: "George Orwell", 
        description: "A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality.", 
        price: 1800, 
        year: 1945,
        numInStock: 25,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669676222/books/AnimalFarm.jpg"
    })
    await addBook({
        title: "Anna Karenina", 
        author: "Leo Tolstoy", 
        description: "Anna is a sophisticated woman who abandons her empty existence as the wife of Karenin and turns to Count Vronsky to fulfil her passionate nature - with tragic consequences.", 
        price: 2100, 
        year: 1878,
        numInStock: 13,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669676237/books/AnnaKarenina.jpg"
    })
    await addBook({
        title: "Crime and Punishment", 
        author: "Fyodor Dostoevsky", 
        description: "Raskolnikov, a destitute and desperate former student, wanders through the slums of St Petersburg and commits a random murder without remorse or regret", 
        price: 1500, 
        year: 1866,
        numInStock: 8,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669676243/books/CrimeAndPunishment.jpg"
    })              
    await addBook({
        title: "Lord of The Flies", 
        author: "William Golding", 
        description: "At the dawn of the next world war, a plane crashes on an uncharted island, stranding a group of schoolboys. At first, with no adult supervision, their freedom is something to celebrate; this far from civilization the boys can do anything they want. Anything. They attempt to forge their own society, failing, however, in the face of terror, sin and evil.", 
        price: 2200, 
        year: 1954,
        numInStock: 13,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1669676251/books/LordOfTheFlies.jpg"
    })
              
}

async function populateCarts() {
    await createCart(1)
    await createCart(2)
    await createCart(2)
    await createCart(2)
    await createCart(2)

    await addBooktoCart({
        itemId: 5, 
        cartId: 1, 
        quantity: 1
    })

    await addBooktoCart({
        itemId: 2, 
        cartId: 1, 
        quantity: 2
    })

    await addBooktoCart({
        itemId: 10, 
        cartId: 2, 
        quantity: 1
    })
    await addBooktoCart({
        itemId: 3, 
        cartId: 3, 
        quantity: 1
    })
    await addBooktoCart({
        itemId: 9, 
        cartId: 4, 
        quantity: 1
    })
    await addBooktoCart({
        itemId: 2, 
        cartId: 5, 
        quantity: 1
    })
}

async function rebuildDB(){
    try{
        // client.connect();
        await dropTables()
        await createTables()
        await populateItems()
        await createInitialUsers()
        await populateCarts()
        

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

        // const createdUser = await createUser(userInfo)
        // console.log("create user", createdUser)

        // const updatedUser = await updateUser(3, updatedUserInfo)
        // console.log("updated user", updatedUser)

        // const allUsers = await getAllUsers()
        // console.log("all users", allUsers)

        // const obtainUser = await getUser({username: "JohnDoe", password: "doeboy"})
        // console.log("one user", obtainUser)

        // const userByUsername = await getUserByUsername('JaneDoe')
        // console.log("I am the username", userByUsername)

        // const userByUserId = await getUserByUserId(3)
        // console.log("user by ID", userByUserId)

        // const userByEmail = await getUserByEmail("johndoe@gmail.com")
        // console.log("user by email", userByEmail)

        // const allBooks = await getAllBooks()
        // console.log("all books:",allBooks);
        
        // const someBooks = await getBooksByAuthor("dr. suess")
        // console.log("some books:",someBooks);
        
        // const singleBook = await getBookByTitle('red fish blue fish')
        // console.log("book titled red fish blue fish:",singleBook);

        // const book3 = await getBookById(3)
        // console.log("book number 3", book3);

        // await updateBook({id: 3, author:"another guy"})
        // const newBook3= await getBookById(3)
        // console.log(newBook3, "this is updated book 3")
        // console.log("finished testing database")

        // const cartlist = await getBooksInCart(1)
        // console.log("this is a list of the items:", cartlist);

        // const cart1 = await getCart(1)
        // console.log("this is cart #1", cart1);
        
        // const cart1withbooks = await getCartWithBooks(1)
        // console.log("this is cart #1 with its books", cart1withbooks);

        // // const deletedCart = await deleteCart(1)
        // // console.log(deletedCart);

        // const updatedCart = await updateCart( {cartId: 1, active: false})
        // console.log("this is the updated cart", updatedCart)

        // const updatedCartItem = await updateCartItem({cartItemId: 2, quantity: 6})
        // console.log("this is the updated quantity", updatedCartItem)

        // const activeCarts = await getActiveCarts()
        // console.log("this is all active cart ids", activeCarts)


    } catch (error) {
        console.error(error);
        throw error;
    } 
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => {client.end()});