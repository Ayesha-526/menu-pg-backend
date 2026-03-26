const express = require("express");
const path = require("path");
const { ObjectId } = require("mongodb");
const { connectDB, getDB } = require("./db");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public")); // your frontend folder

// Connect DB
connectDB();


// 📥 GET all menus (used in student.js)
app.get("/menu", async (req, res) => {
    try {
        const db = getDB();
        const menus = await db.collection("menus").find().toArray();
        res.json(menus);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching menus");
    }
});


// ➕ ADD menu (used in add.js)
app.post("/menu", async (req, res) => {
    try {
        const db = getDB();
        const { date, breakfast, lunch, dinner } = req.body;

        if (!date || !breakfast || !lunch || !dinner) {
            return res.status(400).send("All fields required");
        }

        await db.collection("menus").insertOne({
            date,           // format: YYYY-MM-DD
            breakfast,
            lunch,
            dinner
        });

        res.send("✅ Menu Added");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding menu");
    }
});


// ✏️ UPDATE menu (used in manage.js)
app.put("/menu/:id", async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;
        const { breakfast, lunch, dinner } = req.body;

        await db.collection("menus").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    breakfast,
                    lunch,
                    dinner
                }
            }
        );

        res.send("✅ Menu Updated");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating menu");
    }
});


// ❌ DELETE menu (used in manage.js)
app.delete("/menu/:id", async (req, res) => {
    try {
        const db = getDB();
        const id = req.params.id;

        await db.collection("menus").deleteOne({
            _id: new ObjectId(id)
        });

        res.send("✅ Menu Deleted");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting menu");
    }
});


// ▶️ Start Server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});