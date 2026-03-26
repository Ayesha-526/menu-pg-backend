require("dotenv").config(); // load .env

const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URL; // 🔥 from .env

if (!url) {
    console.error("❌ MONGO_URL not found in .env");
    process.exit(1);
}

const client = new MongoClient(url);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("pg_menu"); // database name
        console.log("✅ MongoDB Atlas Connected");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("❌ DB not initialized. Call connectDB first.");
    }
    return db;
}

module.exports = { connectDB, getDB };