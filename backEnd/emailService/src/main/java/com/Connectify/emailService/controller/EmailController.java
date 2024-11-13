package com.Connectify.emailService.controller;


import com.Connectify.emailService.service.EmailService;
import com.Connectify.emailService.service.EmailServiceImpl;
import com.netflix.discovery.converters.Auto;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailServiceImpl emailService;

    @PostMapping("/send-otp")
    private ResponseEntity<String> sendEmail(@RequestParam String email, @RequestParam String otp) {
        try{
            emailService.sendEmail(email, otp);
        } catch (MessagingException e) {
           return new ResponseEntity<>("Can't send the OTP right now", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>("Otp sent successfully", HttpStatus.OK);
    }

}
