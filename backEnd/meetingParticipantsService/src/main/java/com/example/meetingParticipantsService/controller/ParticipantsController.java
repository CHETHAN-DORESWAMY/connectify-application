package com.example.meetingParticipantsService.controller;

import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import com.example.meetingParticipantsService.service.ParticipantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/participants")
public class ParticipantsController {

    @Autowired
    private ParticipantsService participantsService;

    // Create a new participant
    @PostMapping("/add")
    public ResponseEntity<HashMap<String, Object>> createParticipant(@RequestBody ParticipantsEntity participantsEntity) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            ParticipantsEntity createdParticipant = participantsService.createParticipant(participantsEntity);
            response.put("message", "Participant added successfully");
            response.put("participant", createdParticipant);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            response.put("message", "Error adding participant");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all participants
    @GetMapping("/getAll")
    public ResponseEntity<HashMap<String, Object>> getAllParticipants() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            List<ParticipantsEntity> participants = participantsService.getAllParticipants();
            response.put("message", "Participants fetched successfully");
            response.put("participants", participants);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("message", "Error fetching participants");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get participant by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<HashMap<String, Object>> getParticipantById(@PathVariable String id) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<ParticipantsEntity> participant = participantsService.getParticipantById(id);
            if (participant.isPresent()) {
                response.put("message", "Participant found");
                response.put("participant", participant.get());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Participant not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error fetching participant");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update participant by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<HashMap<String, Object>> updateParticipant(@PathVariable String id, @RequestBody ParticipantsEntity updatedParticipant) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            ParticipantsEntity participant = participantsService.updateParticipant(id, updatedParticipant);
            if (participant != null) {
                response.put("message", "Participant updated successfully");
                response.put("participant", participant);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Participant not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error updating participant");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete participant by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HashMap<String, Object>> deleteParticipant(@PathVariable String id) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            participantsService.deleteParticipant(id);
            response.put("message", "Participant deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            response.put("message", "Error deleting participant");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
