package com.commerce.controller;

import com.commerce.model.entity.RefreshToken;
import com.commerce.model.entity.User;
import com.commerce.model.exception.AppException;
import com.commerce.model.exception.ErrorCode;
import com.commerce.model.request.LoginRequest;
import com.commerce.model.request.SignUpRequest;
import com.commerce.model.response.AuthResponse;
import com.commerce.model.response.UserResponse;
import com.commerce.service.AuthService;
import com.commerce.service.JwtService;
import com.commerce.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
        User user = authService.login(request);
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        refreshTokenService.save(
                RefreshToken.builder()
                        .token(refreshToken)
                        .user(user)
                        .expirationTime(jwtService.extractExpirationInstant(refreshToken))
                        .build()
        );

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(jwtService.getRefreshExpiration()/1000)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .user(UserResponse.from(user))
                .build();
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        if (refreshToken != null) {
            refreshTokenService.delete(refreshToken);
        }
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @PostMapping("/refresh-token")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponse refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
        if(refreshToken == null || refreshToken.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, null);
        }

        var storedRefreshToken = refreshTokenService.findById(refreshToken);
        if(!jwtService.isTokenValid(refreshToken)){
            refreshTokenService.delete(refreshToken);
            var cookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("None")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        }

        User user = storedRefreshToken.getUser();
        var newAccessToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .user(UserResponse.from(user))
                .build();
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signUp(@RequestBody SignUpRequest request, HttpServletResponse response) {
        User user = authService.register(request);
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        refreshTokenService.save(
                RefreshToken.builder()
                        .token(refreshToken)
                        .user(user)
                        .expirationTime(jwtService.extractExpirationInstant(refreshToken))
                        .build()
        );

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("None")
                .maxAge(jwtService.getRefreshExpiration()/1000)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .user(UserResponse.from(user))
                .build();
    }
}

