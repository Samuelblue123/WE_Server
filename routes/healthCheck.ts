import { Request, Router } from "express";
import { DefaultResponse } from "../communication/responses/defaultResponse.js";
import profiler from "v8-profiler-next";
import {beforeEach} from "node:test";

/**
 * Maps a health check endpoint
 */
const healthRouter = Router();

healthRouter.get("/", (request: Request, response: DefaultResponse) => {
    response.status(200).send();
});

export default healthRouter;
