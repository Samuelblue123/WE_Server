import { AppError } from "../base/appError.ts";

export class DatabaseError extends AppError {
    constructor() {
        super("An error has occurred while performing database actions.", 500);
    }
}
