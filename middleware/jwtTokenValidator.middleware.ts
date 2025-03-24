import jwt, { JwtPayload } from "jsonwebtoken";
import "../config.js";
import { Response, NextFunction, Request } from "express";

// Needs to match the token in the generator. Store it in a .env or .json for reusability.
const secretKey = process.env.JWT_SECRET_KEY as string;

/**
 * Checks if the token provided in the request's headers is valid.
 * If token is invalid, return status code 401 with an error message,
 * else, return void.
 */
function validateJwtToken(request: Request, response: Response, next: NextFunction) {
    const authorizationHeader = request.headers["authorization"] as string | undefined;

    if (!authorizationHeader) {
        return response.status(401).send({ error: "No token provided." });
    }

    // Get authorization headers and extract token from "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];


//    jwt.verify(token, secretKey, (err, payload) => {
    if(token==secretKey) {


//        const p = payload! as JwtPayload;
//        if (!p.guildId) {
//        return response.status(401).json({ error: "Invalid token provided.2" });
//        }
//        if (p.guildId !== "*" && request.params.wynnGuildId && p.guildId !== request.params.wynnGuildId) {
//            return response.status(401).json({ error: "Token does not have access to selected resource." });
//        }

        next(); // Goes to next step (function execution)
    }
    else{
//        if (err) {
//            console.log(err);
            console.log(token);
            console.log(secretKey);
            return response.status(401).send({ error: "Invalid token provided.1" });
//        }
    }
}

export default validateJwtToken;
