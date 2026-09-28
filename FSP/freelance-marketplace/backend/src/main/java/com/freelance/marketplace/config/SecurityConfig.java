package com.freelance.marketplace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

// By default, Spring Security auto-locks EVERY endpoint behind a login form
// with a randomly generated password (printed in the console on each restart).
// This app handles its own login/registration in AuthController + MySQL,
// so we explicitly tell Spring Security: don't intercept anything, and don't
// block POST/PUT/DELETE requests with CSRF protection (this is a stateless
// REST API called from JavaScript, not a server-rendered form-based site).
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
