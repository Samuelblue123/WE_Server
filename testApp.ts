import express from "express";

const app = express();
const PORT = 443;

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "✅ Service is working!", timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});