package com.example.meetingParticipantsService.service;

import com.example.meetingParticipantsService.dao.ParticipantsDao;
import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipantsService {

    @Autowired
    private ParticipantsDao participantsRepository;

    // Create a new participant
    public ParticipantsEntity createParticipant(ParticipantsEntity participantsEntity) {
        return participantsRepository.save(participantsEntity);
    }

    // Get all participants
    public List<ParticipantsEntity> getAllParticipants() {
        return participantsRepository.findAll();
    }

    // Get participant by ID
    public Optional<ParticipantsEntity> getParticipantById(String id) {
        return participantsRepository.findById(id);
    }

    // Update participant
    public ParticipantsEntity updateParticipant(String id, ParticipantsEntity updatedParticipant) {
        if (participantsRepository.existsById(id)) {
            updatedParticipant.setParticipantId(id);
            return participantsRepository.save(updatedParticipant);
        } else {
            return null;
        }
    }

    // Delete participant by ID
    public void deleteParticipant(String id) {
        participantsRepository.deleteById(id);
    }
}

