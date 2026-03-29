require("dotenv").config();
const express = require("express");
const cors = require("cors"); // 1. Import CORS
const path = require("path");
const { connectDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
// Allow requests from your frontend domain
app.use(cors()); 
// Parse incoming JSON
app.use(express.json()); 
// Serve static files (if you have them in a /public folder)
app.use(express.static("public")); 

async function startServer() {
    try {
        await connectDB();
        console.log("✅ Connected to MongoDB");

        // ================= GET ALL MENUS =================
        app.get("/menu", async (req, res) => {
            try {
                const db = getDB();
                const menus = await db.collection("menus").find().toArray();
                res.status(200).json(menus);
            } catch (err) {
                console.error("GET ERROR:", err);
                res.status(500).json({ error: "Failed to fetch menus" });
            }
        });

        // ================= POST NEW MENU =================
        app.post("/menu", async (req, res) => {
            try {
                const { date, breakfast, lunch, dinner } = req.body;

                // Validation
                if (!date || !breakfast || !lunch || !dinner) {
                    return res.status(400).json({ error: "All fields are required" });
                }

                const db = getDB();
                const result = await db.collection("menus").insertOne({
                    date,
                    breakfast,
                    lunch,
                    dinner,
                    createdAt: new Date()
                });

                res.status(201).json({ 
                    message: "✅ Menu added successfully", 
                    id: result.insertedId 
                });

            } catch (err) {
                console.error("POST ERROR:", err);
                res.status(500).json({ error: "Server error: Could not save menu" });
            }
        });

        // ================= UPDATE MENU =================
        app.put("/menu/:id", async (req, res) => {
            try {
                const db = getDB();
                const result = await db.collection("menus").updateOne(
                    { _id: new ObjectId(req.params.id) },
                    { $set: req.body }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: "Menu not found" });
                }

                res.json({ message: "Updated successfully" });
            } catch (err) {
                console.error("PUT ERROR:", err);
                res.status(500).json({ error: "Update failed" });
            }
        });

        // ================= DELETE MENU =================
        app.delete("/menu/:id", async (req, res) => {
            try {
                const db = getDB();
                const result = await db.collection("menus").deleteOne({
                    _id: new ObjectId(req.params.id)
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: "Menu not found" });
                }

                res.json({ message: "Deleted successfully" });
            } catch (err) {
                console.error("DELETE ERROR:", err);
                res.status(500).json({ error: "Delete failed" });
            }
        });

        // Catch-all for HTML (Optional)
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "public", "dashboard.html"));
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Stop the server if DB fails
    }
}

startServer();