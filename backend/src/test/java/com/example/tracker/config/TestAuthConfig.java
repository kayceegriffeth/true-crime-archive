package com.example.tracker.config;

import com.example.tracker.services.AuthUtil;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestAuthConfig {

    @Bean
    public AuthUtil authUtil() {
        // Mock AuthUtil to always return "testuser" and admin privileges
        return new AuthUtil() {
            @Override
            public String currentUsername() {
                return "testuser";
            }

            @Override
            public boolean isAdmin() {
                return true;
            }
        };
    }
}
