import {createContext} from "react";
import {User} from "@/types";
export interface AuthContextType {
    isAuthenticated: boolean
    user: User | null
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
} as AuthContextType)

