package com.commerce.config;


import com.commerce.model.entity.Role;
import com.commerce.model.entity.User;
import com.commerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin1 = new User();
            admin1.setUsername("admin");
            admin1.setPassword(passwordEncoder.encode("123456"));
            admin1.setRole(Role.ROLE_ADMIN);
            admin1.setEmail("admin@gmail.com");

            User admin2 = new User();
            admin2.setUsername("admin1");
            admin2.setPassword(passwordEncoder.encode("123456"));
            admin2.setRole(Role.ROLE_ADMIN);
            admin2.setEmail("admin2@gmail.com");

            userRepository.saveAll(Arrays.asList(admin1, admin2));
        }

        if (userRepository.findByUsername("user1").isEmpty()) {
            User user = new User();
            user.setUsername("user1");
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRole(Role.ROLE_USER);
            user.setEmail("user@gmail.com");

            userRepository.save(user);
        }
    }
}