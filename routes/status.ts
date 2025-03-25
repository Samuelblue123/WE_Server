import { Request, Router } from "express";
import { DefaultResponse } from "../communication/responses/defaultResponse.ts";

/**
 * Maps an app status checking endpoint
 */
const statusRouter = Router();


statusRouter.get("/", (request: Request, response: DefaultResponse) => {
    response.status(200).send("Service Live");
})

export default statusRouter;
