import { Request, Router } from "express";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import {beforeEach} from "node:test";

/**
 * Maps a health check endpoint
 */
const healthRouter = Router();

healthRouter.get("/", (request: Request, response: DefaultResponse) => {
    response.status(200);
    console.log(response.statusCode);
    response.send("responseCode: " + response.statusCode);
});

export default healthRouter;
