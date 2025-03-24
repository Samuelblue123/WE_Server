import express from "express";
import app, {server} from "./app.js";
import {connect} from "mongoose";
import bodyParser from "body-parser";
import {registerMessageIndex} from "./sockets/connection.js";

import cors from "cors";
import "./config";
import {errorHandler} from "./middleware/errorHandler.middleware.js";
import {mapEndpoints} from "./endpoints.js";


const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
// Connect to database
try {
    const dbUrl = process.env.DB_URL;
    connect(dbUrl, {retryWrites: true, writeConcern: {w: "majority"}}).then(() => {
    });
    console.log("Database Connected");
    registerMessageIndex()
    server.listen(port, () => {
        console.log(`Socket.io server listening on port ${port}`)
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
}

mapEndpoints(app);
app.use(errorHandler);
