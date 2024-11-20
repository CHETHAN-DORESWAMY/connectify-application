package com.Connectify.emailService.service;

import com.Connectify.emailService.client.MeetingDto;
import jakarta.mail.MessagingException;

public interface EmailService {
    public void sendEmail(String email, String otp) throws MessagingException;
    public void sendDeleteEmail(String empId, String meetingId) throws MessagingException;

    public void sendEmail(MeetingDto meetingDto) throws  MessagingException;
}
