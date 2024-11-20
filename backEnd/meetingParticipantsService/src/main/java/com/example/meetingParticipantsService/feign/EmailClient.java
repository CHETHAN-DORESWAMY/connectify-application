package com.example.meetingParticipantsService.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "emailService", url="http://localhost:8095/api/emails")
public interface EmailClient {

    @GetMapping("/delete-meeting/{empId}/{meetingId}")
    public ResponseEntity<String> sendCanceledMeetingMail(@PathVariable String empId, @PathVariable String meetingId);
}
