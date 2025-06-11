package com.commerce.service;

import com.commerce.model.entity.Role;
import com.commerce.model.entity.User;
import com.commerce.model.exception.AppException;
import com.commerce.model.exception.ErrorCode;
import com.commerce.model.request.LoginRequest;
import com.commerce.model.request.SignUpRequest;
import com.commerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public User login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(()-> new AppException(
                ErrorCode.USERNAME_NOT_FOUND,
                Map.of("username", request.getUsername())
        ));
        return userRepository.save(user);
    }

    public User register(SignUpRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS, Map.of("username", request.getUsername()));
        }

        User newUser = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        return userRepository.save(newUser);
    }

}
