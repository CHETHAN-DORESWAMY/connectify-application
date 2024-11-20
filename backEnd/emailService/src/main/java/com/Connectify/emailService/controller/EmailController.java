package com.Connectify.emailService.controller;


import com.Connectify.emailService.client.MeetingDto;
import com.Connectify.emailService.service.EmailService;
import com.Connectify.emailService.service.EmailServiceImpl;
import com.netflix.discovery.converters.Auto;
import jakarta.mail.MessagingException;
import jakarta.ws.rs.Path;
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

    @PostMapping("/send-meeting-mail")
    public ResponseEntity<String> sendMeetingMail(@RequestBody MeetingDto meetingDto){
        try{

            emailService.sendEmail(meetingDto);

        } catch (MessagingException e) {
            return new ResponseEntity<>("error in sending mail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
    }

    @GetMapping("/delete-meeting/{empId}/{meetingId}")
    public ResponseEntity<String> sendCanceledMeetingMail(@PathVariable String empId, @PathVariable String meetingId){
        try{
            System.out.println("controller" + meetingId);
            emailService.sendDeleteEmail(empId, meetingId);
        }
        catch(MessagingException e){
            return new ResponseEntity<>("error in sending mail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Email sent Successfully", HttpStatus.OK);
    }

}
