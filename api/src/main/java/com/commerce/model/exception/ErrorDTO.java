package com.commerce.model.exception;


import com.commerce.util.PlaceholderUtil;
import lombok.Data;

import java.util.Map;

@Data
public class ErrorDTO {
    private final String code;
    private final String message;
    public ErrorDTO(ErrorCode errorCode, Map<String, String> params) {
        this.code = errorCode.getCode();
        this.message = PlaceholderUtil.replacePlaceholders(errorCode.getMessageEn(), params);
    }
}