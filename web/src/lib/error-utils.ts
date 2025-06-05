import {AppError} from "@/types";
import {toast} from "sonner";

export function isAppError(object: unknown): object is AppError {
    return typeof object === "object" && object !== null && "message" in object && "code" in object;
}

export function showError(error: unknown) {
    if (isAppError(error)) {
        toast.error(error.message.en)
    } else {
        toast.error("An error occurred while creating the order.")
    }
}