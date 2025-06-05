package com.commerce.model.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;

@Builder
@Entity
@Table(name = "oauth_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OAuthToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "third_party_user_id", unique = true)
    private String thirdPartyUserId;

    @Column(name = "access_token", columnDefinition = "TEXT", nullable = false, unique = true)
    private String accessToken;

    @Column(name = "refresh_token", columnDefinition = "TEXT", unique = true)
    private String refreshToken;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();


}
