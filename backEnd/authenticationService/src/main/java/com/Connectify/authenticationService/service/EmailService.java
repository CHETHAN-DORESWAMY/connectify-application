package com.Connectify.authenticationService.service;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailService {

    public void sendEmail(String toEmail, String otp) throws MessagingException {
        String fromEmail = "rdchethan22@gmail.com";
        String host = "smtp.gmail.com";  // Use your SMTP provider

        Properties properties = System.getProperties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "587"); // SMTP port for your email provider
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, "tqxjppegdkirzfvl");
            }
        });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(fromEmail));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
        message.setSubject("Your OTP for Password Reset");
        message.setText("Your OTP is: " + otp);

        Transport.send(message);
    }
}
