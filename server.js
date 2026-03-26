const express = require("express");
const { connectDB } = require("./db");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// START SERVER ONLY AFTER DB CONNECTS
async function startServer() {
    await connectDB(); // 🔥 WAIT here

    app.listen(3000, () => {
        console.log("🚀 Server running on http://localhost:3000");
    });
}

startServer();