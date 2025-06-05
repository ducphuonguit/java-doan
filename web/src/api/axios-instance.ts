import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import { API_CONSTANTS } from '../constants/api';
import {User} from "@/types";
import LOCAL_STORAGE_KEY_CONSTANTS from "@/constants/local-storage-key.ts";

interface ApiError {
    message: string;
    code?: string;
}

interface RefreshResponse {
    accessToken: string;
    user: User;
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL,
    timeout: API_CONSTANTS.TIMEOUT,
    // headers: API_CONSTANTS.HEADERS,
    withCredentials: true
});

const authAxiosInstance = axios.create({
    baseURL: API_CONSTANTS.BASE_URL,
    timeout: API_CONSTANTS.TIMEOUT,
    headers: API_CONSTANTS.HEADERS,
    withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEY_CONSTANTS.ACCESS_TOKEN);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // Check for unauthenticated response (401 status)
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry &&
            originalRequest.url !== API_CONSTANTS.AUTH_ENDPOINT.REFRESH
        ) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await authAxiosInstance.post<RefreshResponse>(
                    API_CONSTANTS.AUTH_ENDPOINT.REFRESH
                );
                const { accessToken, user } = refreshResponse.data;

                // Store new token
                localStorage.setItem(LOCAL_STORAGE_KEY_CONSTANTS.ACCESS_TOKEN, accessToken);
                // Optionally store user dataS
                localStorage.setItem(LOCAL_STORAGE_KEY_CONSTANTS.USER, JSON.stringify(user));

                // Update original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.reject(refreshError);
            }
        }

        const apiError: ApiError = {
            message: error.response?.data?.message || 'An error occurred',
            code: error.response?.status?.toString(),
        };
        return Promise.reject(apiError);
    }
);

export {authAxiosInstance};


export default axiosInstance;