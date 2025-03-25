package com.example.kotlin.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
class SecurityConfig{
    @Bean
    fun sequrityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf{ it.disable()}
            .authorizeHttpRequests{ it.anyRequest().permitAll()}
        return http.build()
    }
}