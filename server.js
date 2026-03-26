require("dotenv").config();

const express = require("express");
const path = require("path");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public")); // frontend folder

// Start server after DB connects
async function startServer() {
    await connectDB();

    // =======================
    // 📥 GET all menus
    // =======================
    app.get("/menu", async (req, res) => {
        try {
            const db = getDB();
            const menus = await db.collection("menus").find().toArray();
            res.json(menus);
        } catch (err) {
            console.error("GET ERROR:", err);
            res.status(500).json({ error: "Failed to fetch menus" });
        }
    });

    // =======================
    // ➕ ADD menu
    // =======================
    app.post("/menu", async (req, res) => {
        try {
            const db = getDB();
            const { date, breakfast, lunch, dinner } = req.body;

            // Validation
            if (!date || !breakfast || !lunch || !dinner) {
                return res.status(400).json({ error: "All fields required" });
            }

            const result = await db.collection("menus").insertOne({
                date,
                breakfast,
                lunch,
                dinner
            });

            res.status(201).json({
                message: "✅ Menu added",
                id: result.insertedId
            });

        } catch (err) {
            console.error("POST ERROR:", err);
            res.status(500).json({ error: "Failed to add menu" });
        }
    });

    // =======================
    // ✏️ UPDATE menu
    // =======================
    app.put("/menu/:id", async (req, res) => {
        try {
            const db = getDB();
            const { id } = req.params;
            const { breakfast, lunch, dinner } = req.body;

            const result = await db.collection("menus").updateOne(
                { _id: new ObjectId(id) },
                { $set: { breakfast, lunch, dinner } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }

            res.json({ message: "✅ Menu updated" });

        } catch (err) {
            console.error("PUT ERROR:", err);
            res.status(500).json({ error: "Failed to update menu" });
        }
    });

    // =======================
    // ❌ DELETE menu
    // =======================
    app.delete("/menu/:id", async (req, res) => {
        try {
            const db = getDB();
            const { id } = req.params;

            const result = await db.collection("menus").deleteOne({
                _id: new ObjectId(id)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }

            res.json({ message: "✅ Menu deleted" });

        } catch (err) {
            console.error("DELETE ERROR:", err);
            res.status(500).json({ error: "Failed to delete menu" });
        }
    });

    // =======================
    // 🚀 START SERVER
    // =======================
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

// Start everything
startServer();