import { AppError } from "../base/appError.ts";

export class ValidationError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 400);
    }
}
