package com.Connectify.emailService.service;

import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {


        @Autowired
        private JavaMailSender mailSender;

        public void sendEmail(String toEmail, String otp) throws MessagingException {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("rdchethan22@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Your OTP for Password Reset");
            helper.setText("Your OTP is: " + otp);

            mailSender.send(message);
        }
    }


