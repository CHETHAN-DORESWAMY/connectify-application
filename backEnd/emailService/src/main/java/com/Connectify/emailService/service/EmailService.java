package com.Connectify.emailService.service;

import jakarta.mail.MessagingException;

public interface EmailService {
    public void sendEmail(String email, String otp) throws MessagingException;

}
