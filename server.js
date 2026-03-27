require("dotenv").config();

const express = require("express");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // ✅ FIXED
app.use(express.static("public"));

async function startServer() {
    await connectDB();

    // GET all menus
    app.get("/menu", async (req, res) => {
        try {
            const db = getDB();
            const menus = await db.collection("menus").find().toArray();
            res.json(menus);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Fetch error" });
        }
    });

    // ADD menu
    app.post("/menu", async (req, res) => {
        try {
            console.log("BODY:", req.body); // 🔥 debug

            const db = getDB();
            const { date, breakfast, lunch, dinner } = req.body;

            if (!date || !breakfast || !lunch || !dinner) {
                return res.status(400).json({ error: "All fields required" });
            }

            await db.collection("menus").insertOne({
                date,
                breakfast,
                lunch,
                dinner
            });

            res.json({ message: "✅ Menu added successfully" });

        } catch (err) {
            console.error("POST ERROR:", err);
            res.status(500).json({ error: "Server error while adding menu" });
        }
    });

    // UPDATE
    app.put("/menu/:id", async (req, res) => {
        try {
            const db = getDB();

            await db.collection("menus").updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );

            res.json({ message: "Updated" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Update error" });
        }
    });

    // DELETE
    app.delete("/menu/:id", async (req, res) => {
        try {
            const db = getDB();

            await db.collection("menus").deleteOne({
                _id: new ObjectId(req.params.id)
            });

            res.json({ message: "Deleted" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Delete error" });
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer();