package com.example.meetingService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Document(collection = "meeting_details")
public class MeetingEntity {

    @Id
    String meetId;
    String meetDescription;
    String meetHostId;
    LocalTime meetStartTime;
    String meetDuration;
    String meetStatus;
    int meetNoOfParticipants;

    public MeetingEntity() {
    }

    public MeetingEntity(String meetId, String meetDescription, String meetHostId, LocalTime meetStartTime, String meetDuration, String meetStatus, int meetNoOfParticipants) {
        this.meetId = meetId;
        this.meetDescription = meetDescription;
        this.meetHostId = meetHostId;
        this.meetStartTime = meetStartTime;
        this.meetDuration = meetDuration;
        this.meetStatus = meetStatus;
        this.meetNoOfParticipants = meetNoOfParticipants;
    }

    public String getMeetId() {
        return meetId;
    }

    public void setMeetId(String meetId) {
        this.meetId = meetId;
    }

    public String getMeetDescription() {
        return meetDescription;
    }

    public void setMeetDescription(String meetDescription) {
        this.meetDescription = meetDescription;
    }

    public String getMeetHostId() {
        return meetHostId;
    }

    public void setMeetHostId(String meetHostId) {
        this.meetHostId = meetHostId;
    }

    public LocalTime getMeetStartTime() {
        return meetStartTime;
    }

    public void setMeetStartTime(LocalTime meetStartTime) {
        this.meetStartTime = meetStartTime;
    }

    public String getMeetDuration() {
        return meetDuration;
    }

    public void setMeetDuration(String meetDuration) {
        this.meetDuration = meetDuration;
    }

    public String getMeetStatus() {
        return meetStatus;
    }

    public void setMeetStatus(String meetStatus) {
        this.meetStatus = meetStatus;
    }

    public int getMeetNoOfParticipants() {
        return meetNoOfParticipants;
    }

    public void setMeetNoOfParticipants(int meetNoOfParticipants) {
        this.meetNoOfParticipants = meetNoOfParticipants;
    }
}
