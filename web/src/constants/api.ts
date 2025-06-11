export const API_CONSTANTS = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 100000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
    PRODUCT_ENDPOINT: "/products",
    AUTH_ENDPOINT: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh-token',
        SIGNUP: '/auth/signup',
    }
};