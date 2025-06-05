package com.commerce.model.exception;


import com.commerce.util.PlaceholderUtil;

import java.util.Map;

public class AppException extends RuntimeException {
    private final ErrorCode errorCode;
    private final Map<String, String> messageParams;

    public AppException(ErrorCode errorCode, Map<String, String> messageParams) {
        super(errorCode.getMessageEn());
        this.errorCode = errorCode;
        this.messageParams = messageParams;
    }

    @Override
    public String getMessage() {
        if (messageParams != null) {
            return PlaceholderUtil.replacePlaceholders(errorCode.getMessageEn(), messageParams);
        }
        return errorCode.getMessageEn();
    }

    // Getters
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public Map<String, String> getMessageParams() {
        return messageParams;
    }
}