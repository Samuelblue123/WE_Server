import {AppError} from "../base/appError.ts";

export class HttpClientError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}