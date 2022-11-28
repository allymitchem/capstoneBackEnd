const client = require('./client');

async function addCart(userId) {
    //do we need to check that the userId is valid?
try {
    const {rows: [cart]} = await client.query(`
        INSERT INTO carts("userId")
        VALUES $1
        RETURNING *
    `, [userId])
    return cart
} catch (error) {
    console.error(error)
}
}

module.exports = {
    addCart
}