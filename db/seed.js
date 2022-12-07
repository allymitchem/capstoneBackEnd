const client = require('./client');
const {addBook, getAllBooks, getBooksByAuthor, getBookByTitle, getBookById, updateBook, createCart, addBookToCart, getBooksInCart, getCart, getCartWithBooks, deleteCartItem, deleteCart, updateCart, updateCartItem, getActiveCarts, getCartsByUser, getActiveCartByUser} = require('./');
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
            genre VARCHAR(255) NOT NULL,
            year INTEGER,
            price INTEGER NOT NULL,
            "numInStock" INTEGER NOT NULL,
            CONSTRAINT chk_genre CHECK (genre IN ('fantasy', 'mystery', 'classics', 'romance', 'youngAdult'))
        );
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            "firstName" VARCHAR(255) NOT NULL,
            "lastName" VARCHAR(255) NOT NULL,
            "shippingAddress" VARCHAR(255),
            "cardNumber" INTEGER,
            expiration INTEGER,
            "billingAddress" VARCHAR(255)
        );
        CREATE TABLE carts(
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            active BOOLEAN DEFAULT true,
            UNIQUE ("userId", active)
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
        email: "johndoe@gmail.com",
        firstName: "John",
        lastName: "Doe"

    })
    const jane = await createUser({
        username: "JaneDoe",
        password: "doegirl",
        email: "janedoe@yahoo.com",
        firstName: "Jane",
        lastName:"Doe"
    })
    const kaylan = await createUser({
        username: "Kaylan",
        password: "itsme",
        email: "kaylan@yahoo.com",
        firstName: "Kaylan",
        lastName: "Thompson"
    })
    const forrest = await createUser({
        username: "Forrest",
        password: "forrest123",
        email: "forrest@yahoo.com",
        firstName: "Forrest",
        lastName: "McCLure"
    })
    const lisa = await createUser({
        username: "LisaG",
        password: "lisa123",
        email: "lisa@yahoo.com",
        firstName: "Lisa",
        lastName: "G"
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
        genre: "classics",
        price: 2000, 
        year: 1813,
        numInStock: 8,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670137416/books/71_NGGc4GmS_huvf54.jpg"
    })    
    await addBook({
        title: "1984", 
        author: "George Orwell", 
        description: "The scene is London, where there has been no new housing since 1950 and where the city-wide slums are called Victory Mansions. Science has abandoned Man for the State. As every citizen knows only too well, war is peace.", 
        genre: "classics",
        price: 2100, 
        year: 1949,
        numInStock: 5,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670281721/books/15ec002794a8901dfd83b2351bff7610---orwell-computer-illustration_xk1w6b.jpg"
    })   
    await addBook({
        title: "To Kill A Mockingbird", 
        author: "Harper Lee", 
        description: "Compassionate, dramatic, and deeply moving, 'To Kill A Mockingbird' takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos.", 
        genre: "classics",
        price: 1800, 
        year: 1960,
        numInStock: 6,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670282785/books/9781784870799-jacket-hsize_seqncw.jpg"
    })
    await addBook({
        title: "The Great Gatsby", 
        author: "F. Scott Fitzgerald", 
        description: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted 'gin was the national drink and sex the national obsession,' it is an exquisitely crafted tale of America in the 1920s.", 
        genre: "classics",
        price: 1900, 
        year: 1925,
        numInStock: 9,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670137039/books/81n1NYzXIxL_ks5njv.jpg"
    })
    await addBook({
        title: "The Catcher in the Rye", 
        author: "J.D. Salinger", 
        description: "The Catcher in the Rye is an all-time classic in coming-of-age literature- an elegy to teenage alienation, capturing the deeply human need for connection and the bewildering sense of loss as we leave childhood behind.",
        genre: "classics", 
        price: 2200, 
        year: 1951,
        numInStock: 10,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670134928/books/thecatcherintherye_yuvuok.jpg"
    })
    await addBook({
        title: "Catch-22", 
        author: "Joseph Heller", 
        description: "Set in Italy during World War II, this is the story of the incomparable, malingering bombardier, Yossarian, a hero who is furious because thousands of people he has never met are trying to kill him. But his real problem is not the enemy—it is his own army, which keeps increasing the number of missions the men must fly to complete their service. Yet if Yossarian makes any attempt to excuse himself from the perilous missions he’s assigned, he’ll be in violation of Catch-22, a hilariously sinister bureaucratic rule: a man is considered insane if he willingly continues to fly dangerous combat missions, but if he makes a formal request to be removed from duty, he is proven sane and therefore ineligible to be relieved.",
        genre: "classics", 
        price: 1500, 
        year: 1961,
        numInStock: 5,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670282588/books/1233220139-4d1d2600fc964e42dc2278685b5b855d_aunvzf.jpg"
    })
    await addBook({
        title: "Jane Eyre", 
        author: "Charlotte Bronte", 
        description: "Orphaned as a child, Jane has felt an outcast her whole young life. Her courage is tested once again when she arrives at Thornfield Hall, where she has been hired by the brooding, proud Edward Rochester to care for his ward Adèle. Jane finds herself drawn to his troubled yet kind spirit. She falls in love. Hard.", 
        genre: "classics",
        price: 2200, 
        year: 1847,
        numInStock: 12,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670283500/books/81udJdH-X8L_trh3gm.jpg"
    })
    await addBook({
        title: "Great Expectations", 
        author: "Charles Dickens", 
        description: "In what may be Dickens's best novel, humble, orphaned Pip is apprenticed to the dirty work of the forge but dares to dream of becoming a gentleman — and one day, under sudden and enigmatic circumstances, he finds himself in possession of 'great expectations'.",
        genre: "classics", 
        price: 1500, 
        year: 1860,
        numInStock: 7,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670135296/books/9780143106272_uxx3ez.jpg"
    })
    await addBook({
        title: "Wuthering Heights", 
        author: "Emily Bronte", 
        description: "At the centre of this novel is the passionate love between Catherine Earnshaw and Heathcliff - recounted with such emotional intensity that a plain tale of the Yorkshire moors acquires the depth and simplicity of ancient tragedy.",
        genre: "classics", 
        price: 2200, 
        year: 1847,
        numInStock: 12,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670282486/books/flat_750x_075_f-pad_750x1000_f8f8f8_epm9uy.jpg"
    })
    await addBook({
        title: "Little Women", 
        author: "Louisa May Alcott", 
        description: "Here are talented tomboy and author-to-be Jo, tragically frail Beth, beautiful Meg, and romantic, spoiled Amy, united in their devotion to each other and their struggles to survive in New England during the Civil War.",
        genre: "classics", 
        price: 2200, 
        year: 1868,
        numInStock: 15,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670137208/books/9781847495877-385x600_ikxczt.jpg"
    })
    await addBook({
        title: "Animal Farm", 
        author: "George Orwell", 
        description: "A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality.",
        genre: "classics", 
        price: 1800, 
        year: 1945,
        numInStock: 25,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670282143/books/71emGmd0vtL_brkep3.jpg"
    })
    await addBook({
        title: "Anna Karenina", 
        author: "Leo Tolstoy", 
        description: "Anna is a sophisticated woman who abandons her empty existence as the wife of Karenin and turns to Count Vronsky to fulfil her passionate nature - with tragic consequences.",
        genre: "classics", 
        price: 2100, 
        year: 1878,
        numInStock: 13,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670282075/books/54138478_qgltq2.jpg"
    })
    await addBook({
        title: "Crime & Punishment", 
        author: "Fyodor Dostoevsky", 
        description: "Raskolnikov, a destitute and desperate former student, wanders through the slums of St Petersburg and commits a random murder without remorse or regret",
        genre: "classics", 
        price: 1500, 
        year: 1866,
        numInStock: 8,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670283227/books/41nLV5axVFL._SX321_BO1_204_203_200__ytqizh.jpg"
    })              
    await addBook({
        title: "Lord of The Flies", 
        author: "William Golding", 
        description: "At the dawn of the next world war, a plane crashes on an uncharted island, stranding a group of schoolboys. At first, with no adult supervision, their freedom is something to celebrate; this far from civilization the boys can do anything they want. Anything. They attempt to forge their own society, failing, however, in the face of terror, sin and evil.",
        genre: "classics", 
        price: 2200, 
        year: 1954,
        numInStock: 13,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670281830/books/9783125738041-us_oe5zbq.jpg"
    })

    await addBook({
        title: "Moth", 
        author: "Amber McBride", 
        description: "Moth has lost her family in an accident. Though she lives with her aunt, she feels alone and uprooted. Until she meets Sani, a boy who is also searching for his roots. If he knows more about where he comes from, maybe he will be able to understand his ongoing depression. And if Moth can help him feel grounded, then perhaps she too will discover the history she carries in her bones.At the dawn of the next world war, a plane crashes on an uncharted island, stranding a group of schoolboys. At first, with no adult supervision, their freedom is something to celebrate; this far from civilization the boys can do anything they want. Anything. They attempt to forge their own society, failing, however, in the face of terror, sin and evil.",
        genre: "youngAdult", 
        price: 2300, 
        year: 2021,
        numInStock: 30,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670344572/Site%20Images/Extra%20Books/50498335_ikzz4s.jpg"
    })
    await addBook({
        title: "Firekeeper's Daughter", 
        author: "Angeline Boulley", 
        description: "As a biracial, unenrolled tribal member and the product of a scandal, Daunis Fontaine has never quite fit in—both in her hometown and on the nearby Ojibwe reservation. When her family is struck by tragedy, Daunis puts her dreams on hold to care for her fragile mother. ",
        genre: "youngAdult", 
        price: 2500, 
        year: 2021,
        numInStock: 45,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670344435/Site%20Images/Extra%20Books/52346471_qixdsn.jpg"
    })
    await addBook({
        title: "The Gilded Ones", 
        author: "Namina Forna", 
        description: "Sixteen-year-old Deka lives in fear and anticipation of the blood ceremony that will determine whether she will become a member of her village. Already different from everyone else because of her unnatural intuition, Deka prays for red blood so she can finally feel like she belongs. But on the day of the ceremony, her blood runs gold, the color of impurity--and Deka knows she will face a consequence worse than death.",
        genre: "youngAdult", 
        price: 2400, 
        year: 2021,
        numInStock: 47,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670344315/Site%20Images/Extra%20Books/40024121._SY475__nfddet.jpg"
    })
    await addBook({
        title: "Shine", 
        author: "Lauren Myracle", 
        description: "When her best guy friend falls victim to a vicious hate crime, sixteen-year-old Cat sets out to discover who in her small town did it. Richly atmospheric, this daring mystery mines the secrets of a tightly knit Southern community and examines the strength of will it takes to go against everyone you know in the name of justice.",
        genre: "youngAdult", 
        price: 2100, 
        year: 2021,
        numInStock: 36,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670344192/Site%20Images/Extra%20Books/8928054_a5lec0.jpg"
    })
    await addBook({
        title: "One True Loves", 
        author: "Taylor Jenkins Reid", 
        description: "In her twenties, Emma Blair marries her high school sweetheart, Jesse. They build a life for themselves, far away from the expectations of their parents and the people of their hometown in Massachusetts. They travel the world together, living life to the fullest and seizing every opportunity for adventure. On their first wedding anniversary, Jesse is on a helicopter over the Pacific when it goes missing. Just like that, Jesse is gone forever.",
        genre: "romance", 
        price: 1900, 
        year: 2016,
        numInStock: 49,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670344023/Site%20Images/Extra%20Books/27189194._SY475__awgrtj.jpg"
    })
    await addBook({
        title: "A Court of Mist and Fury", 
        author: "Sarah J. Maas", 
        description: "Feyre has undergone more trials than one human woman can carry in her heart. Though she’s now been granted the powers and lifespan of the High Fae, she is haunted by her time Under the Mountain and the terrible deeds she performed to save the lives of Tamlin and his people. As her marriage to Tamlin approaches, Feyre’s hollowness and nightmares consume her. She finds herself split into two different people: one who upholds her bargain with Rhysand, High Lord of the feared Night Court, and one who lives out her life in the Spring Court with Tamlin. While Feyre navigates a dark web of politics, passion, and dazzling power, a greater evil looms. She might just be the key to stopping it, but only if she can harness her harrowing gifts, heal her fractured soul, and decide how she wishes to shape her future—and the future of a world in turmoil.",
        genre: "fantasy", 
        price: 2100, 
        year: 2020,
        numInStock: 53,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670344005/Site%20Images/Extra%20Books/50659468._SY475__cwmqhf.jpg"
    })
    await addBook({
        title: "The Silent Patient", 
        author: "Alex Michaelides", 
        description: "Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London’s most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
        genre: "mystery", 
        price: 2100, 
        year: 2019,
        numInStock: 28,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670362603/Site%20Images/Extra%20Books/40097951._SY475__lnnbdt.jpg"
    })
    await addBook({
        title: "Gone Girl", 
        author: "Gillian Flynn", 
        description: "Who are you? What have we done to each other? These are the questions Nick Dunne finds himself asking on the morning of his fifth wedding anniversary when his wife Amy suddenly disappears. The police suspect Nick. Amy's friends reveal that she was afraid of him, that she kept secrets from him. He swears it isn't true. A police examination of his computer shows strange searches. He says they weren't made by him. And then there are the persistent calls on his mobile phone.",
        genre: "mystery", 
        price: 2500, 
        year: 2014,
        numInStock: 38,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670363557/Site%20Images/Extra%20Books/19288043_vbjvrz.jpg"
    })
    await addBook({
        title: "The Thirteenth Tale", 
        author: "Diane Setterfield", 
        description: "Who are you? What have we done to each other? These are the questions Nick Dunne finds himself asking on the morning of his fifth wedding anniversary when his wife Amy suddenly disappears. The police suspect Nick. Amy's friends reveal that she was afraid of him, that she kept secrets from him. He swears it isn't true. A police examination of his computer shows strange searches. He says they weren't made by him. And then there are the persistent calls on his mobile phone.",
        genre: "mystery", 
        price: 2500, 
        year: 2014,
        numInStock: 38,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670376691/Site%20Images/Extra%20Books/40440_njrmar.jpg"
    })
    await addBook({
        title: "Ugly Love", 
        author: "Colleen Hoover", 
        description: "When Tate Collins meets airline pilot Miles Archer, she knows it isn’t love at first sight. They wouldn’t even go so far as to consider themselves friends. The only thing Tate and Miles have in common is an undeniable mutual attraction. Once their desires are out in the open, they realize they have the perfect set-up. He doesn’t want love, she doesn’t have time for love, so that just leaves the sex. Their arrangement could be surprisingly seamless, as long as Tate can stick to the only two rules Miles has for her. Never ask about the past. Don’t expect a future.",
        genre: "romance", 
        price: 2500, 
        year: 2014,
        numInStock: 49,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670369508/Site%20Images/Extra%20Books/17788401._SY475__jesv2k.jpg"
    })
    await addBook({
        title: "The Seven Husbands of Evelyn Hugo", 
        author: "Taylor Jenkins Reid", 
        description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now?",
        genre: "romance", 
        price: 2500, 
        year: 2017,
        numInStock: 49,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670374805/Site%20Images/Extra%20Books/32620332._SY475__daflpt.jpg"
    })
    await addBook({
        title: "The House in the Cerulean Sea", 
        author: "T.J. Klune", 
        description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now?",
        genre: "fantasy", 
        price: 1900, 
        year: 2020,
        numInStock: 49,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670375006/Site%20Images/Extra%20Books/45047384._SY475__zsjaiu.jpg"
    })
    await addBook({
        title: "Before I Let Go", 
        author: "Kennedy Ryan", 
        description: "Their love was supposed to last forever. But when life delivered blow after devastating blow, Yasmen and Josiah Wade found that love alone couldn’t solve or save everything.It couldn’t save their marriage.",
        genre: "romance", 
        price: 2500, 
        year: 2022,
        numInStock: 57,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670375156/Site%20Images/Extra%20Books/60568471_orta18.jpg"
    })
    await addBook({
        title: "The Kiss Quotient", 
        author: "Helen Hoang", 
        description: "It's high time for Stella Lane to settle down and find a husband - or so her mother tells her. This is no easy task for a wealthy, successful woman like Stella, who also happens to have Asperger's. Analyzing data is easy; handling the awkwardness of one-on-one dates is hard. To overcome her lack of dating experience, Stella decides to hire a male escort to teach her how to be a good girlfriend.",
        genre: "romance", 
        price: 1900, 
        year: 2018,
        numInStock: 25,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670375363/Site%20Images/Extra%20Books/38224633._SY475__sfchqr.jpg"
    })
    await addBook({
        title: "Inspection", 
        author: "Josh Malerman", 
        description: "J is a student at a school deep in a forest far away from the rest of the world. J is one of only twenty-six students, all of whom think of the school’s enigmatic founder as their father. J’s peers are the only family he has ever had. The students are being trained to be prodigies of art, science, and athletics, and their life at the school is all they know—and all they are allowed to know. But J suspects that there is something out there, beyond the pines, that the founder does not want him to see, and he’s beginning to ask questions. What is the real purpose of this place? Why can the students never leave? And what secrets is their father hiding from them? Meanwhile, on the other side of the forest, in a school very much like J’s, a girl named K is asking the same questions. J has never seen a girl, and K has never seen a boy. As K and J work to investigate the secrets of their two strange schools, they come to discover something even more mysterious: each other.",
        genre: "mystery", 
        price: 1900, 
        year: 2019,
        numInStock: 25,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670375755/Site%20Images/Extra%20Books/41058632._SY475__kf5bxs.jpg"
    })
    await addBook({
        title: "Pretty Girls", 
        author: "Karin Slaughter", 
        description: "Twenty years ago Claire Scott's eldest sister, Julia, went missing. No one knew where she went - no note, no body. It was a mystery that was never solved and it tore her family apart. Now another girl has disappeared, with chilling echoes of the past. And it seems that she might not be the only one. Claire is convinced Julia's disappearance is linked. But when she begins to learn the truth about her sister, she is confronted with a shocking discovery, and nothing will ever be the same...",
        genre: "mystery", 
        price: 2000, 
        year: 2015,
        numInStock: 25,
        imageURL: "https://res.cloudinary.com/fsa2/image/upload/v1670375596/Site%20Images/Extra%20Books/25574782._SY475__tv4vhx.jpg"
    })
}

async function populateCarts() {
    await createCart(1)
    await createCart(2)
    await createCart(4)  
    await createCart(3)  

    await addBookToCart({
        itemId: 5, 
        cartId: 1, 
        quantity: 1
    })

    await addBookToCart({
        itemId: 2, 
        cartId: 1, 
        quantity: 2
    })

    await addBookToCart({
        itemId: 10, 
        cartId: 1, 
        quantity: 5
    })
    await addBookToCart({
        itemId: 3, 
        cartId: 2, 
        quantity: 10
    })
    await addBookToCart({
        itemId: 9, 
        cartId: 3, 
        quantity: 3
    })
    await addBookToCart({
        itemId: 2, 
        cartId: 3, 
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
    // try {
    //     console.log("Starting to test database...")

    //     const createdUser = await createUser(userInfo)
    //     console.log("create user", createdUser)

    //     const updatedUser = await updateUser(3, updatedUserInfo)
    //     console.log("updated user", updatedUser)

    //     const allUsers = await getAllUsers()
    //     console.log("all users", allUsers)

    //     const obtainUser = await getUser({username: "JohnDoe", password: "doeboy"})
    //     console.log("one user", obtainUser)

    //     const userByUsername = await getUserByUsername('JaneDoe')
    //     console.log("I am the username", userByUsername)

    //     const userByUserId = await getUserByUserId(3)
    //     console.log("user by ID", userByUserId)

    //     const userByEmail = await getUserByEmail("johndoe@gmail.com")
    //     console.log("user by email", userByEmail)

    //     const allBooks = await getAllBooks()
    //     console.log("all books:",allBooks);
        
    //     const someBooks = await getBooksByAuthor("dr. suess")
    //     console.log("some books:",someBooks);
        
    //     const singleBook = await getBookByTitle('red fish blue fish')
    //     console.log("book titled red fish blue fish:",singleBook);

    //     const book3 = await getBookById(3)
    //     console.log("book number 3", book3);

    //     await updateBook({id: 3, author:"another guy"})
    //     const newBook3= await getBookById(3)
    //     console.log(newBook3, "this is updated book 3")
    //     console.log("finished testing database")

    //     const cartlist = await getBooksInCart(3)
    //     console.log("this is a list of the items:", cartlist);

    //     const cart1 = await getCart(1)
    //     console.log("this is cart #1", cart1);
        
    //     const cart3withbooks = await getCartWithBooks(3)
    //     console.log("this is cart #3 with its books", cart3withbooks);

    //     const deletedCart = await deleteCart(1)
    //     console.log(deletedCart);

    //     const updatedCart = await updateCart( {cartId: 1, active: false})
    //     console.log("this is the updated cart", updatedCart)

    //     const updatedCartItem = await updateCartItem({cartItemId: 2, quantity: 6})
    //     console.log("this is the updated quantity", updatedCartItem)

    //     const activeCarts = await getActiveCarts()
    //     console.log("this is all active cart ids", activeCarts)

    //     const userCarts = await getCartsByUser(3)
    //     console.log("this is user 3's cart", userCarts)

    //     await updateCart({cartId: 3, active: null})
        
    //     await createCart(4)
    
    //     const userActiveCart = await getActiveCartByUser(3)
    //     console.log("this is the active cart of user 3", userActiveCart)

    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // } 
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => {client.end()});