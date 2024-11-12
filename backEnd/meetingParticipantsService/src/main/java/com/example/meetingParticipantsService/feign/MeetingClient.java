package com.example.meetingParticipantsService.feign;

import com.example.meetingParticipantsService.client.Meeting;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "meetingService", url = "http://localhost:8092/meetings")  // Update the URL and port as necessary
public interface MeetingClient {

    @GetMapping("/scheduled")
    List<Meeting> getMeetingsByDateAndIds(@RequestParam("date") String date,
                                          @RequestParam("ids") List<String> ids);
}

