package com.commerce.model.response;

import com.commerce.model.entity.User;
import lombok.Data;

import java.time.Instant;

@Data
public class UserResponse {
    private int id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;
    private String avatarUrl;
    private AuditResponse audit;

    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        response.id = user.getId();
        response.fullName = user.getFullName();
        response.email = user.getEmail();
        response.phoneNumber = user.getPhoneNumber();
        response.role = user.getRole().getName();
        response.username = user.getUsername();
        response.avatarUrl = user.getAvatarUrl();
        response.audit = AuditResponse.from(user);
        return response;
    }

}
