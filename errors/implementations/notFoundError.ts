import { AppError } from "../base/appError.ts";

export class NotFoundError extends AppError {
    constructor(errorMessage: string) {
        super(errorMessage, 404);
    }
}
