package com.example.meetingParticipantsService.service;

import com.example.meetingParticipantsService.client.Meeting;
import com.example.meetingParticipantsService.dao.ParticipantsDao;
import com.example.meetingParticipantsService.dto.MeetingDateDto;
import com.example.meetingParticipantsService.dto.ParticipantsDto;
import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import com.example.meetingParticipantsService.feign.MeetingClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ParticipantsService {

    @Autowired
    private ParticipantsDao participantsRepository;

    @Autowired
    private MeetingClient meetingClient;

    // Create a new participant
    public void createParticipant(ParticipantsDto participants) {
        int n = participants.getParticipantsIds().size();
        for(int i = 0; i < n; i++){
            ParticipantsEntity participantsEntity = new ParticipantsEntity(participants.getParticipantsIds().get(i), participants.getMeetingId(),"pending");
            participantsRepository.save(participantsEntity);
        }
    }

    public List<Meeting> getMeetingsForParticipantOnDate(String participantId, String date) {
        // Retrieve all meeting IDs associated with the participant
//        List<String> meetingIds = participantsRepository.findMeetIdByEmpId(participantId);
//        System.out.println(meetingIds.get(0));

        List<String> meetingIds = participantsRepository.findByEmpId(participantId).stream()
                .map(ParticipantsEntity::getMeetId).collect(Collectors.toList());
        // Fetch meetings for the specific date and meeting IDs using Feign client
//        System.out.println(meetingIds.get(0));
        return meetingClient.getMeetingsByDateAndIds(new MeetingDateDto(date, meetingIds)).getBody();
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

