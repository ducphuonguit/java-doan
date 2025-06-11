package com.commerce.model.exception;


import com.commerce.util.PlaceholderUtil;
import lombok.Getter;

import java.util.Map;

@Getter
public class AppException extends RuntimeException {
    // Getters
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

}