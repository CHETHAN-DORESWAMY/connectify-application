package com.example.meetingService.service;

import com.example.meetingService.dao.MeetingDao;
import com.example.meetingService.entity.MeetingEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {

    @Autowired
    private MeetingDao meetingDao;

    // CREATE: Save a new meeting
    public MeetingEntity createMeeting(MeetingEntity meeting) {
        return meetingDao.save(meeting);
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
    public MeetingEntity updateMeeting(String id, MeetingEntity meetingDetails) {
        Optional<MeetingEntity> existingMeeting = meetingDao.findById(id);
        if (existingMeeting.isPresent()) {
            MeetingEntity meeting = existingMeeting.get();
            meeting.setMeetDescription(meetingDetails.getMeetDescription());
            meeting.setMeetHostId(meetingDetails.getMeetHostId());
            meeting.setMeetStartTime(meetingDetails.getMeetStartTime());
            meeting.setMeetDuration(meetingDetails.getMeetDuration());
            meeting.setMeetStatus(meetingDetails.getMeetStatus());
            meeting.setMeetNoOfParticipants(meetingDetails.getMeetNoOfParticipants());
            return meetingDao.save(meeting);
        }
        return null;
    }

    // DELETE: Delete a meeting by its ID
    public void deleteMeeting(String id) {
        meetingDao.deleteById(id);
    }
}
