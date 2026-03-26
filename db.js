const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("pg_menu");
    console.log("✅ MongoDB Connected");
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };