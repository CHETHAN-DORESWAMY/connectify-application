package com.Connectify.authenticationService.controller;

import com.Connectify.authenticationService.service.OTPService;
import com.Connectify.authenticationService.service.OTPValidationService;
import com.Connectify.authenticationService.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password")
public class PasswordController {

    @Autowired
    private OTPService otpService;

    @Autowired
    private OTPValidationService otpValidationService;

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        return new ResponseEntity<>(otpService.generateAndSendOTP(email), HttpStatus.OK);

    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) {
        boolean isOtpValid = otpValidationService.validateOTP(email, otp);
        if (isOtpValid) {
            passwordService.changePassword(email, newPassword);
            return "Password updated successfully";
        }
        return "Invalid OTP or OTP expired";
    }
}
