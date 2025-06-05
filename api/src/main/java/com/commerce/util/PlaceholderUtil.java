package com.commerce.util;

import java.util.Map;

public class PlaceholderUtil {
    public static String replacePlaceholders(String message, Map<String, String> params) {
        if (message == null || params == null || params.isEmpty()) {
            return message;
        }
        for (Map.Entry<String, String> entry : params.entrySet()) {
            message = message.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return message;
    }
}
