package com.example.meetingService.service;

import com.example.meetingService.dao.MeetingDao;
import com.example.meetingService.dto.MeetingDto;
import com.example.meetingService.entity.MeetingEntity;
import com.example.meetingService.feign.EmailClient;
import com.example.meetingService.feign.ParticipantsClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {

    @Autowired
    private MeetingDao meetingDao;

    @Autowired
    private ParticipantsClient participantsClient;

    @Autowired
    private EmailClient emailClient;

    // CREATE: Save a new meeting
    public MeetingEntity createMeeting(MeetingDto meeting) {
        MeetingEntity meetingData = new MeetingEntity();
        meetingData.setMeetId(meeting.getMeetId());
        meetingData.setMeetName(meeting.getMeetName());
        meetingData.setMeetDescription(meeting.getMeetDescription());
        meetingData.setMeetHostId(meeting.getMeetHostId());
        // Combine meetDate and meetStartTime to set meetStartDateTime
        LocalDateTime startDateTime = LocalDateTime.of(LocalDate.parse(meeting.getMeetDate()), meeting.getMeetStartTime());
        meetingData.setMeetStartDateTime(startDateTime);

        // Combine meetDate and meetEndTime to set meetEndDateTime
        LocalDateTime endDateTime = LocalDateTime.of(LocalDate.parse(meeting.getMeetDate()), meeting.getMeetEndTime());
        meetingData.setMeetEndDateTime(endDateTime);
        meetingData.setMeetDuration(meeting.getMeetDuration());
        meetingData.setMeetNoOfParticipants(meeting.getNoParticipants());
        meetingData.setMeetingDate(meeting.getMeetDate());
        meetingData.setMeetStatus("Pending");

        emailClient.sendMeetingMail(meeting);


        return meetingDao.save(meetingData);
    }

    public List<MeetingEntity> getMeetingsByDateAndIds(String date, List<String> ids) {
//        meetingDao.findByMeetIdIn(ids).get(0)
        return meetingDao.findByMeetingDateAndMeetIdIn(date, ids);

    }

    // READ: Get all meetings
    public List<MeetingEntity> getAllMeetings() {
        return meetingDao.findAll();
    }

    // READ: Get a meeting by its ID
    public Optional<MeetingEntity> getMeetingById(String id) {
        return meetingDao.findById(id);
    }

    // UPDATE: Update an existing meeting
    public MeetingEntity updateMeeting(String id, MeetingDto meeting) {
        Optional<MeetingEntity> existingMeeting = meetingDao.findById(id);
        if (existingMeeting.isPresent()) {
            MeetingEntity meetingData = existingMeeting.get();
            meetingData.setMeetName(meeting.getMeetName());
            meetingData.setMeetDescription(meeting.getMeetDescription());

            LocalDateTime startDateTime = LocalDateTime.of(LocalDate.parse(meeting.getMeetDate()), meeting.getMeetStartTime());
            meetingData.setMeetStartDateTime(startDateTime);
            LocalDateTime endDateTime = LocalDateTime.of(LocalDate.parse(meeting.getMeetDate()), meeting.getMeetEndTime());
            meetingData.setMeetEndDateTime(endDateTime);

            meetingData.setMeetHostId(meeting.getMeetHostId());
            meetingData.setMeetDuration(meeting.getMeetDuration());
            return meetingDao.save(meetingData);
        }
        return null;
    }

    // DELETE: Delete a meeting by its ID
    public String deleteMeeting(String id) {
//        System.out.println(meetingDao.deleteById(id));
        meetingDao.deleteByMeetId(id);
        return participantsClient.deleteByMeetId(id).getBody();


    }
}
