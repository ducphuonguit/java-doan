package com.commerce.service;

import com.commerce.model.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.access-token-expiration}")
    private long jwtExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    public long getRefreshExpiration() {
        return refreshExpiration * 86400000L;
    }

    public long getTokenExpiration() {
//        return jwtExpiration * 86400000L;
        return jwtExpiration * 1000L;
    }

    public int extractUserId(String token) {
        return extractClaim(token, claims -> Integer.parseInt(claims.get("userId", String.class)));
    }

    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        try {
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract claim: " + e.getMessage(), e);
        }
    }

    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        var expiration = extractExpiration(token);
        var currentTime = new Date();
        var isBefore = expiration.before(new Date());
        return extractExpiration(token).before(new Date());

    }

    private Date extractExpiration(String token) {
        Claims claims = extractAllClaims(token);
        Object exp = claims.get("exp");

        if (exp instanceof Date) {
            return (Date) exp;
        } else if (exp instanceof Integer) {
            return new Date(((Integer) exp).longValue() * 1000);
        } else if (exp instanceof Long) {
            return new Date((Long) exp * 1000);
        } else if (exp instanceof String) {
            return new Date(Long.parseLong((String) exp) * 1000);
        } else {
            throw new RuntimeException("Unexpected format for expiration claim: " + exp);
        }
    }

    public Instant extractExpirationInstant(String token) {
        return extractExpiration(token).toInstant();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", String.valueOf(user.getId()));
        return generateToken(extraClaims, user);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, getTokenExpiration());
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", String.valueOf(user.getId()));
        return buildToken(extraClaims, user, getRefreshExpiration());
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
