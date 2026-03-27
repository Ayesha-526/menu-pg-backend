require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URL);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("pg_menu");
        console.log("✅ MongoDB Atlas Connected");
    } catch (err) {
        console.error("❌ DB ERROR:", err);
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error("DB not connected");
    return db;
}

module.exports = { connectDB, getDB };