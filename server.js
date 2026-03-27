require("dotenv").config();

const express = require("express");
const path = require("path");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public")); // 🔥 VERY IMPORTANT

async function startServer() {
    await connectDB();

    // ================= GET =================
    app.get("/menu", async (req, res) => {
        try {
            const db = getDB();
            const menus = await db.collection("menus").find().toArray();
            res.json(menus);
        } catch (err) {
            console.error("GET ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    });

    // ================= POST =================
    app.post("/menu", async (req, res) => {
        try {
            console.log("BODY:", req.body);

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
            res.status(500).json({ error: err.message });
        }
    });

    // ================= UPDATE =================
    app.put("/menu/:id", async (req, res) => {
        try {
            const db = getDB();

            await db.collection("menus").updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );

            res.json({ message: "Updated" });

        } catch (err) {
            console.error("PUT ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    });

    // ================= DELETE =================
    app.delete("/menu/:id", async (req, res) => {
        try {
            const db = getDB();

            await db.collection("menus").deleteOne({
                _id: new ObjectId(req.params.id)
            });

            res.json({ message: "Deleted" });

        } catch (err) {
            console.error("DELETE ERROR:", err);
            res.status(500).json({ error: err.message });
        }
    });

    // Optional: open homepage
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "dashboard.html"));
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer();