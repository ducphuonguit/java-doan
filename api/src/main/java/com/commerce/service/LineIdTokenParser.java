package com.commerce.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class LineIdTokenParser {

    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LineIdTokenPayload {
        public String iss;
        public String sub;
        public String aud;
        public long exp;
        public long iat;
        public String nonce;
        public String name;
        public String email;
        public String picture;

        // Getters and setters can be added here if needed
    }

    public LineIdTokenPayload parseIdToken(String idToken) {
        String[] parts = idToken.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT format for LINE id_token");
        }

        String payloadBase64 = parts[1];
        byte[] decodedBytes = Base64.getUrlDecoder().decode(payloadBase64);
        String payloadJson = new String(decodedBytes);

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(payloadJson, LineIdTokenPayload.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse LINE id_token payload", e);
        }
    }
}
