package com.commerce.model.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    INTERNAL_SERVER_ERROR(
            "INTERNAL_SERVER_ERROR",
            "Internal server error",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INVALID_REFRESH_TOKEN(
            "INVALID_REFRESH_TOKEN",
            "Invalid refresh token",
            HttpStatus.UNAUTHORIZED
    ),
    UNAUTHORIZED(
            "UNAUTHORIZED",
            "Unauthorized",
            HttpStatus.UNAUTHORIZED
    ),
    PRODUCT_NOT_FOUND(
            "PRODUCT_NOT_FOUND",
            "Product {id} not found",
            HttpStatus.NOT_FOUND
    ),
    USER_NOT_FOUND(
            "USER_NOT_FOUND",
            "User {id} not found",
            HttpStatus.NOT_FOUND
    ),
    TOKEN_NOT_FOUND(
            "TOKEN_NOT_FOUND",
            "Token {id} not found",
            HttpStatus.NOT_FOUND
    ),
    TOKEN_EXPIRED(
            "TOKEN_EXPIRED",
            "Token expired",
            HttpStatus.UNAUTHORIZED
    ),
    REFRESH_TOKEN_EXPIRED(
            "REFRESH_TOKEN_EXPIRED",
            "Refresh token expired",
            HttpStatus.UNAUTHORIZED
    ),
    ACCESS_DENIED(
            "ACCESS_DENIED",
            "Access denied",
            HttpStatus.FORBIDDEN
    ),
    USERNAME_ALREADY_EXISTS(
            "USERNAME_ALREADY_EXISTS",
            "Username {username} already exists",
            HttpStatus.BAD_REQUEST
    ),
    USERNAME_NOT_FOUND(
            "USERNAME_NOT_FOUND",
            "Username {username} not found",
            HttpStatus.NOT_FOUND
    ),
    INVALID_CREDENTIALS(
            "INVALID_CREDENTIALS",
            "Invalid credentials",
            HttpStatus.UNAUTHORIZED
    );

    private final String code;
    private final String messageEn;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String messageEn, HttpStatus httpStatus) {
        this.code = code;
        this.messageEn = messageEn;
        this.httpStatus = httpStatus;
    }

    // Getters
    public String getCode() {
        return code;
    }

    public String getMessageEn() {
        return messageEn;
    }


    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}