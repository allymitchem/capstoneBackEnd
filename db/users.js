const client = require("./client");
const bcrypt = require("bcrypt");
//check if we need to include SALT_COUNT in .env

async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `SELECT id, username, password, email
    FROM users;
    `
    );
    // console.log(user, "this is all users");
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


//STILL NEEDING TO PREVENT CREATION OF USER WITH SAME EMAIL
async function createUser({ username, password, email }) {
  const SALT_COUNT = 12;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, email)
      VALUES($1, $2, $3)
      
      RETURNING *;
    `,
      [username, hashedPassword, email]
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const SALT_COUNT = 12;
  const hashedPassword = await bcrypt.hash(fields.password, SALT_COUNT);
 
  
 
  const updatedObj = {username: fields.username, password:hashedPassword, email:fields.email}


  const setString = Object.keys(updatedObj)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log("I am set String", setString);
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(updatedObj)
    );
     
    delete user.password;
  
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  let passwordsMatch = await bcrypt.compare(password, hashedPassword);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
  SELECT * 
  FROM users
  WHERE username = $1;
  `,
      [username]
    );
    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows : [user] } = await client.query(
      `
    SELECT * FROM users
    WHERE username = $1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUserId(userId) {
  try { 
    const {
      rows: [user]
    } = await client.query(`
    SELECT * 
    FROM users
    WHERE "id" = ${userId}
    `)
    if (!user){
      return null
    }
    delete user.password
    return user 
  } catch(error){
    throw error
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  getUserByUsername,
  getUser,
  getUserByUserId
};
