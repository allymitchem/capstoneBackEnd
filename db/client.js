const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/graceshopper-dev';

const client = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
// client.on('connect', (client)=>{
//     console.log('i am connecting')
// })
module.exports = client;