package com.Connectify.authenticationService.controller;

import com.Connectify.authenticationService.dto.UserLogin;
import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import com.Connectify.authenticationService.service.UserCredentialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class UserCredentialsController {

    @Autowired
    private UserCredentialsService userCredService;

    @Autowired
    private AuthenticationManager authenticationManager;


    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserCredentialsEntity user) {
        Map<String, Object> response = new HashMap<>();
        try {

            if (userCredService.userExists(user.getEmail())) {
                response.put("message", "User already exists");

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            UserCredentialsEntity createdUser = userCredService.register(user);
            response.put("message", "User registered successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/validate/token")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = userCredService.verifyToken(token);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserLogin user) {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
            if (authentication.isAuthenticated()) {
                String token = userCredService.generateToken(user.getEmail());
                response.put("message", "Login successful");
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("message",e.getMessage()) ;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
