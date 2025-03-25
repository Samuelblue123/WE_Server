import jwt from "jsonwebtoken";
import "../config.ts";
import {TokenResponse} from "../communication/responses/tokenResponse.ts";
import {TokenError} from "../errors/implementations/tokenError.ts";

export class JwtTokenHandler {
    private readonly secretKey: string;
    private readonly refreshKey: string;
    private readonly options: jwt.SignOptions;

    private constructor() {
        this.secretKey = process.env.JWT_SECRET_KEY;
        this.refreshKey = process.env.JWT_REFRESH_SECRET_KEY || "placeholder";
        this.options = {expiresIn: "24h"};
    }

    static create() {
        return new JwtTokenHandler();
    }

    async generateToken(
        validationKey: string,
    ): Promise<TokenResponse> {
        if (validationKey === process.env.JWT_VALIDATION_KEY) {
            return this.signJwtToken("to be implemented");
        }
        return this.signJwtToken("to be implemented");
    }

    private signJwtToken(username: string): TokenResponse {
        let response: TokenResponse;

        const jwtToken = jwt.sign({username: username}, this.secretKey, this.options);
        const refreshToken = jwt.sign({username: "placeholder"}, this.refreshKey, {expiresIn: "7d"});

        response = new TokenResponse(jwtToken, refreshToken);
        return response;
    }

}

