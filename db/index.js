const { query } = require("express");
const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/graceshopper-dev',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });


    
    
module.exports = {
};
