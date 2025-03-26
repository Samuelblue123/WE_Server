import { io } from "../app.js";
import {Server, Socket, RemoteSocket} from "socket.io";
import "../config.js";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../types/socketIOTypes.js";
import {IServer2WynnMessage, IWynnMessage} from "../types/messageTypes.js";
import { getOnlineUsers, isOnline } from "../utils/socketUtils.js";
import { usernameToUuid } from "../communication/httpClients/mojangApiClient.js";
import { checkVersion } from "../utils/versionUtils.js";
import UserModel from "../models/entities/userModel.js";
import { getChannelFromWynnGuild } from "../utils/serverUtils.js";
import userModel from "../models/entities/userModel.js";

const ENCODED_DATA_PATTERN = /([\u{F0000}-\u{FFFFD}]|[\u{100000}-\u{10FFFF}])+/gu;
const wynnMessagePatterns: IWynnMessage[] = [
    { pattern: /^§#00bdbfff((󏿼󏿿󏿾)|(󏿼󐀆))§#00bdbfff The (?<worldevent>.+?)+ World Event starts $/, messageType: 1 }
];

const messageIndex: { [key: string]: number } = {};
var messageParts:string[] = [];
var worldEvent:string="";
var worldEventParts:string[] = [];
var concatMessage:string = "";


export function registerMessageIndex() {
    const allowedEvents:string[] = ["HaywireDefender", "ApproachingRaid", "SkitteringSpiders", "OvertakenFarm", "ArachnidAmbush", "EncroachingBlaze", "DarkDeacons", "EncroachingDestruction", "CorruptedSpring", "NecromanticSite", "RisenReturn", "EncroachingMisery", "TaintedShoreline", "AeonOrigin", "BowelsoftheRoots", "EncroachingReanimation", "ImproperBurialRites", "Blood-EncrustedMastaba", "EncroachingConflagration", "FailedHunt", "CanineAmbush", "BlazingCombustion", "EncroachingAblation", "RogueWyrmling", "SlimySchism", "SwashbucklingBrawl", "DesperateAmbush", "ABurningMemory", "EncroachingExtinction", "PeculiarGrotto", "LightEmissaries", "UnsettlingEncounters", "VisitfromBeyond", "AbandonedSentinels", "RealmicAntigen", "TerritorialTrolls", "ColossiIngrain", "EnragedEagle", "Ruff&Tumble", "DespermechOccupation", "DecommissionedWarMachines", "BubblingTerrace", "InfernalCaldera", "MaarAshpit", "ShatteredRoots", "AhmsMonuments", "IncomprehensibleCynosure", "ShapesintheDark", "AllEyesonMe", "MonumenttoLoss", "PestilentialDownpour", "OtherworldlyExhibition"];
    allowedEvents.forEach(event => {
        messageIndex[event] = 0;
    })
}
const processedMessages = new Set<string>();


const errorHandler = (toHandle: Function) => {
    const handleError = (error: Error) => {
        console.error("socket error:", error);
    };
    return (...args: any[]) => {
        try {
            const ret = toHandle.apply(this, args);
            if (ret && typeof ret.catch === "function") {
                ret.catch(handleError);
            }
        } catch (e: any) {
            handleError(e);
        }
    };
};

export default function registerSocketHandlers(
    io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) {
    io.use((socket, next) => {
        // Accessing query parameters sent from the client
        const username = socket.handshake.query.username as string;
        const modVersion = socket.handshake.query.modVersion as string;
        const uuid = socket.handshake.query.uuid as string;

        // Set them in the socket data
        socket.data.username = username || undefined;
        socket.data.modVersion = modVersion || "0.0.0";
        socket.data.uuid = uuid;
        socket.data.messageIndex=0;

        // Proceed with the connection
        next();
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        console.log(socket.data.username + " connected to server with version: " + socket.data.modVersion);

        socket.on("error", (err:any)=>{
            console.error("Socket error on", socket.id, ":", err);
            }
        );
        socket.on("wynnMessage", async (message) => {
            //if (!checkVersion(socket.data.modVersion)) {
              //  console.log(`skipping request from outdated mod version: ${socket.data.modVersion}`);
                //return;
            //}

            messageParts = [];
            concatMessage = "";
            worldEvent="";
            messageParts = message.split(":");
            worldEvent=messageParts[0];
            worldEventParts=worldEvent.split(" ");
            for (let i = 0; i < worldEventParts.length; i++) {
                concatMessage += worldEventParts[i];
            }
            socket.data.messageIndex=messageIndex[concatMessage];

            console.log("WynnMessage received:", message);
            console.log(
                message,
                "emitted by:",
                socket.data.username,
                "uuid:",
                socket.data.uuid
            );


            if(!processedMessages.has(concatMessage)) {
                processedMessages.add(concatMessage)
                await notifUsers(message);
            }
        });

        socket.on("sync", () => {
            socket.data.messageIndex = messageIndex[0];
        });

        socket.on("disconnect", (reason) => {
            console.log(`${socket.data.username} disconnected: ${reason}`);
        });
    });
}

export async function notifUsers(message:string){
    const allSockets = await io.fetchSockets();
    allSockets.forEach(async (s) => {
        if (await shouldBNotif(s)) {
            s.emit("serverMessage", message);
        }
    });
}

export async function shouldBNotif(socket:RemoteSocket<ServerToClientEvents,SocketData>) {
    const uuids= await getUuids();
    var notific =false;
    uuids.forEach(uuid => {
        if(socket.data.uuid===uuid){
            notific = true;
        }
    });
    return notific;
}

export async function getUuids() {
    const jsonUsers= await findUsers();
    var uuids:string[] = [];
//    jsonUsers.forEach(user => {
//        uuids.push(user.uuid);
//    });
    return uuids;
}

export async function findUsers() {
    const query = userModel.find({worldevents: concatMessage});
    const users = await query.exec();
    try {
        if (!users) {
            const tester = users;
            console.log(tester)
        }
    } catch (error) {
        return
    }
    return users;
}

setInterval(() => {
    processedMessages.clear();
}, 90 * 1000); // every 90 seconds
