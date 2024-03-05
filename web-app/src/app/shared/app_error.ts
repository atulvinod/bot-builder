import { StatusCodes } from "http-status-codes";

export const appErrorsStatus = {
    USER_SESSION_FAILED: 900,
    CHAT_HISTORY_FETCH_FAILED: 901,
};

export class AppError extends Error {
    statusCode: StatusCodes;
    appErrorCode?: number;
    constructor(
        statusCode: StatusCodes,
        message: string,
        appErrorCode?: number
    ) {
        super(message);
        this.statusCode = statusCode;
        this.appErrorCode = appErrorCode;
    }

    getStatusCode() {
        return this.statusCode;
    }
}
