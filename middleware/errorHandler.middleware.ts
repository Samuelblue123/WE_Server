import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/base/appError.ts";
import { ErrorResponse, HttpErrorResponse } from "../communication/responses/errorResponse.ts";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) next(err);
    console.warn("error from route:", req.originalUrl, "method:", req.method);
    if (err instanceof AppError) {
        console.error(err.message, err.stack);

        res.status(err.statusCode).send(ErrorResponse.createWithError(err));
    } else {
        console.error("Unexpected error:", err);

        res.status(500).send(HttpErrorResponse.InternalServerError);
    }
};
