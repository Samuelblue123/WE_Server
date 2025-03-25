import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "./types/socketIOTypes.ts";
import validateSocket from "./sockets/security/socketValidator.ts";
import registerSocketHandlers from "./sockets/connection.ts";


const app = express();
const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server);


//io.on("connection", (socket)=>{
//        console.log("AAAAAAAa")
//});

io.engine.on("connection_error", (err) => {
    console.error("Global connection error from Engine.IO:", err);
});

registerSocketHandlers(io);

io.on("new_namespace", (namespace) => {
    console.log("1");
    namespace.use(validateSocket);
});




export {io, server };
export default app;
