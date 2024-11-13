package com.Connectify.authenticationService.service;

import com.Connectify.authenticationService.dao.OTPRepository;
import com.Connectify.authenticationService.entity.OTP;
import com.Connectify.authenticationService.otpverification.OTPGenerator;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class OTPService {

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private EmailService emailService;

    public void generateAndSendOTP(String email) {
        String otp = OTPGenerator.generateOTP();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5); // OTP valid for 5 minutes

        // Save OTP in the database
        OTP otpRecord = new OTP(email, otp, expirationTime);
        otpRepository.save(otpRecord);

        // Send OTP to email
        try {
            emailService.sendEmail(email, otp);
        } catch (MessagingException e) {
            // Handle email sending failure
            e.printStackTrace();
        }
    }
}
