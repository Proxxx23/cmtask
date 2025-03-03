import { Response } from 'express';
import {StatusCodes} from 'http-status-codes';

type Message = string;

export type ErrorResponse = {
    code: number;
    message: Message;
}

export type ApiResponse<T extends Record<string, any>> = Promise<Response<T[]> | Response<ErrorResponse>>;

export const respondBadRequest = (res: Response, message: Message): Response<ErrorResponse> => {
    return res.status(StatusCodes.BAD_REQUEST).json(
        {
            code: StatusCodes.BAD_REQUEST,
            message
        }
    );
}

export const respondNotFound = (res: Response, message: Message): Response<ErrorResponse> => {
    return res.status(StatusCodes.NOT_FOUND).json(
        {
            code: StatusCodes.NOT_FOUND,
            message
        }
    );
}

export const respondInternalError = (res: Response): Response<ErrorResponse> => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
        {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error',
        }
    );
}
