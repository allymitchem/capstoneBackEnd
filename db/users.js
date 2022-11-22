const client = require('./client');

async function getAllUsers () {
  try{
  const { rows } = await client.query(
    `SELECT id, username, password, email
    FROM users;
    `
  )
  console.log(rows, "this is all users")
  return rows;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function createUser({
  username,
  password,
  email
}) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, email)
      VALUES($1, $2, $3)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, password, email])
   
    return user
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function updateUser(id, fields = {}) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
    console.log("I am set String", setString)
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }

    try{
      const {rows: [user] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${ id }
      RETURNING *;
      `, Object.values(fields));
      
      return user
    }catch (error) {
      throw error;
    }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser
}