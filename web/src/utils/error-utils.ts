import {AppError} from "@/types";

export default function parseError(error: unknown){
    console.log("error:",error);
    if(isAppError(error)){
        return error.message
    }
    return error?.toString() ?? "An unknown error occurred";
}

function isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}