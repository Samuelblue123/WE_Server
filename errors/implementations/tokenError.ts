import {AppError} from "../base/appError.ts";

export class TokenError extends AppError {
    constructor() {
        super("An error occurred while generating your token.", 400);
    }
}