package com.commerce.service;

import com.commerce.model.entity.RefreshToken;
import com.commerce.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public void save(RefreshToken refreshToken) {
        refreshTokenRepository.save(refreshToken);
    }

    public void delete(String token) {
        RefreshToken existingToken = refreshTokenRepository.findById(token).orElseThrow(
                () -> new RuntimeException("Refresh token not found")
        );
        refreshTokenRepository.delete(existingToken);
    }

    public RefreshToken findById(String token) {
        return refreshTokenRepository.findById(token).orElseThrow(
                () -> new RuntimeException("Refresh token not found")
        );
    }
}