import type {User} from "@/types";

export function getUserInitial(user: User): string {
    const getFirstChar = (value: string | null | undefined): string =>
        value?.trim().charAt(0).toUpperCase() || '';

    return (
        getFirstChar(user.fullName) ||
        getFirstChar(user.email) ||
        getFirstChar(user.username) ||
        ''
    );
}

export function getUserFullName(user: User): string {
    return (
        user.fullName ||
        user.username ||
        user.email ||
        ''
    );
}

export const getUserNameWithPhoneNumber = (user: User) => {
    return `${user.fullName || user.username || user.email}${user.phoneNumber ? ` - ${user.phoneNumber}` : ""}`
}
