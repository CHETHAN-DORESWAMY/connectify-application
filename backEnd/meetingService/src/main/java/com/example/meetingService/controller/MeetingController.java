package com.example.meetingService.controller;

import com.example.meetingService.dto.MeetingDto;
import com.example.meetingService.entity.MeetingEntity;
import com.example.meetingService.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
    public ResponseEntity<HashMap<String, Object>> createMeeting(@RequestBody MeetingDto meetingDto) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            MeetingEntity createdMeeting = meetingService.createMeeting(meetingDto);
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

    @GetMapping("/scheduled")
    public ResponseEntity<List<MeetingEntity>> getMeetingsByDateAndIds(@RequestParam String date, @RequestParam List<String> ids) {
        try {
            // Define the expected date format (e.g., "yyyy-MM-dd")
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate parsedDate = LocalDate.parse(date, formatter);

            List<MeetingEntity> meetings = meetingService.getMeetingsByDateAndIds(parsedDate, ids);
            if (meetings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(meetings);
        } catch (DateTimeParseException e) {
            // Handle invalid date format
            return ResponseEntity.badRequest().body(null);
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
    public ResponseEntity<HashMap<String, Object>> updateMeeting(@PathVariable String id, @RequestBody MeetingDto updatedMeeting) {
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
