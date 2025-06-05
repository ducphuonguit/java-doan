import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "@/context/auth/AuthContext.ts";
import {AxiosError} from "axios";
import axiosInstance, {authAxiosInstance} from "@/api/axios-instance.ts";
import {User} from "@/types";
import LOCAL_STORAGE_KEY_CONSTANTS from "@/constants/local-storage-key.ts";
import {API_CONSTANTS} from "@/constants/api.ts";

interface AuthResponse {
    accessToken: string;
    user: User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem(LOCAL_STORAGE_KEY_CONSTANTS.ACCESS_TOKEN);
        const userData = localStorage.getItem(LOCAL_STORAGE_KEY_CONSTANTS.USER);

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await authAxiosInstance.post<AuthResponse>(API_CONSTANTS.AUTH_ENDPOINT.LOGIN, {
                username,
                password,
            });
            const { accessToken, user } = response.data;

            localStorage.setItem(LOCAL_STORAGE_KEY_CONSTANTS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(LOCAL_STORAGE_KEY_CONSTANTS.USER, JSON.stringify(user));

            setIsAuthenticated(true);
            setUser(user);
            return true;
        } catch (error: unknown) {

            if(error instanceof AxiosError){
                console.error("Login failed:", error.message);
            }else{
                console.error("Login failed:", error);
            }
            return false;

        }
    };

    const logout = async () => {
        try {
            // Optional: Call logout endpoint if your API supports it
            await axiosInstance.post(API_CONSTANTS.AUTH_ENDPOINT.LOGOUT);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem(LOCAL_STORAGE_KEY_CONSTANTS.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEY_CONSTANTS.USER);
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}