package com.commerce.service;


import com.commerce.model.entity.OAuthToken;
import com.commerce.repository.OAuthTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthTokenService {
    private final OAuthTokenRepository oAuthTokenRepository;

    public OAuthToken save(OAuthToken oAuthToken) {
        return oAuthTokenRepository.save(oAuthToken);
    }
}
