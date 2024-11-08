package com.example.meetingService.controller;

import com.example.meetingService.entity.MeetingEntity;
import com.example.meetingService.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    // Create a new meeting
    @PostMapping("/add")
    public ResponseEntity<HashMap<String, Object>> createMeeting(@RequestBody MeetingEntity meetingEntity) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            MeetingEntity createdMeeting = meetingService.createMeeting(meetingEntity);
            response.put("message", "Meeting created successfully");
            response.put("meeting", createdMeeting);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            response.put("message", "Error creating meeting");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all meetings
    @GetMapping("/getAll")
    public ResponseEntity<HashMap<String, Object>> getAllMeetings() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            List<MeetingEntity> meetings = meetingService.getAllMeetings();
            response.put("message", "Meetings fetched successfully");
            response.put("meetings", meetings);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("message", "Error fetching meetings");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get meeting by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<HashMap<String, Object>> getMeetingById(@PathVariable String id) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<MeetingEntity> meeting = meetingService.getMeetingById(id);
            if (meeting.isPresent()) {
                response.put("message", "Meeting found");
                response.put("meeting", meeting.get());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Meeting not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error fetching meeting");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update meeting by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<HashMap<String, Object>> updateMeeting(@PathVariable String id, @RequestBody MeetingEntity updatedMeeting) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            MeetingEntity meeting = meetingService.updateMeeting(id, updatedMeeting);
            if (meeting != null) {
                response.put("message", "Meeting updated successfully");
                response.put("meeting", meeting);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Meeting not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error updating meeting");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete meeting by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, Object>> deleteMeeting(@PathVariable String id) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            meetingService.deleteMeeting(id);
            response.put("message", "Meeting deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            response.put("message", "Error deleting meeting");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
