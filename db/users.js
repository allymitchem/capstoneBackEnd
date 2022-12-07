const client = require("./client");
const bcrypt = require("bcrypt");
//check if we need to include SALT_COUNT in .env

async function getAllUsers() {
  try {
    const { rows } = await client.query(
      `SELECT id, username, password, email, "firstName", "lastName"
    FROM users;
    `
    );
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createUser({ username, password, email, firstName, lastName, shippingAddress, cardNumber, expiration, billingAddress}) {
  const SALT_COUNT = 12;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, email, "firstName", "lastName", "shippingAddress", "cardNumber", expiration, "billingAddress")
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      
      RETURNING *;
    `,
      [username, hashedPassword, email, firstName, lastName, shippingAddress, cardNumber, expiration, billingAddress]
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

  const updatedObj = {
    username: fields.username,
    password: hashedPassword,
    email: fields.email,
    firstName: fields.firstName,
    lastName: fields.lastName,
    shippingAddress: fields.shippingAddress,
    cardNumber: fields.cardNumber,
    expiration: fields.expiration,
    billingAddress: fields.billingAddress
  };

  const setString = Object.keys(updatedObj)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
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
  if (user) {
    const hashedPassword = user.password;
    let passwordsMatch = await bcrypt.compare(password, hashedPassword);
    
      if (passwordsMatch) {
        delete user.password;
        return user;
      } else {
        return null;
      }
    } else {
      return null
    }
  }


async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
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
      rows: [user],
    } = await client.query(`
    SELECT * 
    FROM users
    WHERE "id" = ${userId}
    `);
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE email = $1
    `,
      [email]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  getUserByUsername,
  getUser,
  getUserByUserId,
  getUserByEmail,
};
