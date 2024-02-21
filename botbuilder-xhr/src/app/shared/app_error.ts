import { StatusCodes } from "http-status-codes";
export class AppError extends Error {
    statusCode: StatusCodes;
    constructor(statusCode: StatusCodes, message: string) {
        super(message);
        this.statusCode = statusCode;
    }

    getStatusCode() {
        return this.statusCode;
    }
}
