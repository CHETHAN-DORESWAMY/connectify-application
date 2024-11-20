package com.Connectify.emailService.service;

import com.Connectify.emailService.client.EmployeeEntity;
import com.Connectify.emailService.client.MeetingDto;
import com.Connectify.emailService.client.MeetingEntity;
import com.Connectify.emailService.feign.EmployeeClient;
import com.Connectify.emailService.feign.MeetingClient;
import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {


    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmployeeClient employeeClient;

    @Autowired
    private MeetingClient meetingClient;

    @Override
    public void sendEmail(String toEmail, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("rdchethan22@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject("Your OTP for Password Reset");
        helper.setText("Your OTP is: " + otp);

        mailSender.send(message);
    }

    @Override
    public void sendDeleteEmail(String empId, String meetingId) throws MessagingException {
        EmployeeEntity employeeEntity =  employeeClient.getEmployeeByIdForFeign(empId).getBody();
        System.out.println(meetingId);
        MeetingEntity meetingDto =  meetingClient.getMeetingByIdForFeign(meetingId).getBody();
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("rdchethan22@gmail.com");
            System.out.println(employeeEntity.getEmpEmail());
            helper.setTo(employeeEntity.getEmpEmail());
            helper.setSubject(meetingDto.getMeetName());
            helper.setText("Since we are busy in other task meeting get canceled" + meetingDto.getMeetName() + " " + "scheduled on" + meetingDto.getMeetingDate());
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }



    @Override
    public void sendEmail(MeetingDto meetingDto) throws MessagingException {
        List<String> participants = meetingDto.getMeetParticipants();


        employeeClient.getEmployeeByIds(participants).getBody().forEach((participant)->{
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setFrom("rdchethan22@gmail.com");
                helper.setTo(participant.getEmpEmail());
                helper.setSubject(meetingDto.getMeetName());
                helper.setText("This is the meeting link of the meeting" + meetingDto.getMeetName() + " " + "scheduled on" + meetingDto.getMeetDate());
                mailSender.send(message);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });



    }
}


