package com.example.tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // enable CORS, WebConfig handles details
                .authorizeHttpRequests(auth -> auth
                        // Allow preflight requests through
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Allow all API requests (your frontend controls role logic)
                        .anyRequest().permitAll()
                )
                .httpBasic(httpBasic -> {}); // still available if needed

        return http.build();
    }
}
