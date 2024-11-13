package com.Connectify.authenticationService.controller;

import com.Connectify.authenticationService.dto.UserLogin;
import com.Connectify.authenticationService.entity.UserCredentialsEntity;
import com.Connectify.authenticationService.service.OTPService;
import com.Connectify.authenticationService.service.OTPValidationService;
import com.Connectify.authenticationService.service.PasswordService;
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

    @Autowired
    private OTPService otpService;

    @Autowired
    private OTPValidationService otpValidationService;

    @Autowired
    private PasswordService passwordService;

    @GetMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        return new ResponseEntity<>(otpService.generateAndSendOTP(email), HttpStatus.OK);

    }

    @GetMapping("/validate-otp")
    public ResponseEntity<String> validateOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpValidationService.validateOTP(email, otp);
        if (isValid) {
            return new ResponseEntity<>("OTP is valid", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid OTP", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {

        passwordService.changePassword(email, newPassword);
        return new ResponseEntity<>("password changed successfully", HttpStatus.OK);


    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserCredentialsEntity user) {
        Map<String, Object> response = new HashMap<>();
        try {

            if (userCredService.userExists(user.getEmail()) || userCredService.userExistsById(user.getId())) {
                response.put("message", "User already exists");

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            UserCredentialsEntity createdUser = userCredService.register(user);
            response.put("data", user);
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
