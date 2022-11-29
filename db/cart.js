const { query } = require('express');
const client = require('./client');

async function createCart(userId) {
    //do we need to check that the userId is valid?
try {
    const {rows: [cart]} = await client.query(`
        INSERT INTO carts("userId")
        VALUES ($1)
        RETURNING *
    ;`, [userId])
    return cart
} catch (error) {
    console.error(error)
}
}

async function addBooktoCart({itemId, cartId, quantity}) {
    //again a user check is needed here but on what level????
    try {
        const {rows: [cartItem]} = await client.query(`
            INSERT INTO cart_items("itemId", "cartId", quantity)
            VALUES ($1, $2, $3)
            RETURNING *
        ;`, [itemId, cartId, quantity])
        return cartItem
    } catch (error) {
        console.error(error)
    }
}

async function getItemNumInCart(cartId) {
    try {
        const {rows} = await client.query(`
            SELECT * FROM cart_items
            WHERE "cartId"=$1
        ;`,[cartId])
        //delete cartID?
        return rows
    } catch (error) {
        console.error(error)
    }
}

async function getBooksInCart(cartId) {
    try {
        const {rows: books} = await client.query(`
            SELECT items.*, cart_items.*
            FROM items
            JOIN cart_items ON cart_items."itemId" = items.id
            WHERE cart_items."cartId" = $1
        ;`, [cartId])
        books.forEach(elem => {delete elem.cartId})
        return books
    } catch (error) {
        console.error(error)
    }
}

async function getCart(cartId) {
    try {
        const {rows: cart} = await client.query(`
            SELECT carts.*, users.username AS "creatorName"
            FROM carts
            JOIN users ON "userId" = users.id
            WHERE carts.id = $1
        ;`, [cartId])
        return cart
    } catch (error) {
        console.error(error)
    }
}

async function getCartWithBooks(cartId) {
    try {
        const {rows: [cart]} = await client.query(`
            SELECT carts.*, users.username AS "creatorName"
            FROM carts
            JOIN users ON "userId" = users.id
            WHERE carts.id = $1
        ;`, [cartId])
        
        const items = await getBooksInCart(cartId)
        cart.items = items
        return cart
    } catch (error) {
        console.error(error)
    }
}

async function deleteCartItem(cartItemId) {
    try {
        const {rows: [deletedItem]} = await client.query(`
            DELETE FROM cart_items
            WHERE id=$1
            RETURNING *
        ;`, [cartItemId])
        return deletedItem
    } catch (error) {
        console.error(error)
    }
}

async function deleteCart(cartId) {
    try {
        await client.query(`
            DELETE FROM cart_items
            WHERE "cartId"=$1
        ;`, [cartId])
        
        const {rows: [cart]} = await client.query(`
            DELETE FROM carts
            WHERE id=$1
            RETURNING *
        ;`, [cartId])

        return cart
    } catch (error) {
        console.error(error)
    }
}

async function updateCart({cartId, ...fields}) {
    try {
        const setStr = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');
        const {rows: [updatedCart]} = await client.query(`
            UPDATE carts
            SET ${setStr}
            WHERE id=${cartId}
            RETURNING *;
        ;`, Object.values(fields))
        return updatedCart
    } catch (error) {
        console.error(error)
    }
}

async function updateCartItem({cartItemId, quantity}) {
    try {
        const {rows: [updatedCartItem]} = await client.query(`
            UPDATE cart_items
            SET quantity = $1
            WHERE id=${cartItemId}
            RETURNING *
        ;`, [quantity])
        return updatedCartItem
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    createCart,
    addBooktoCart,
    getBooksInCart,
    getCart,
    getCartWithBooks,
    deleteCart,
    deleteCartItem,
    updateCart,
    updateCartItem
}