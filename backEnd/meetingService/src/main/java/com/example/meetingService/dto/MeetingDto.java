package com.example.meetingService.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class MeetingDto {

    String meetName;
    String meetDescription;
    String meetHostId;
    LocalTime meetStartTime;
    LocalTime meetEndTime;
    LocalDate meetDate;
    String meetDuration;
    List<String> participantsId;

    public MeetingDto() {
    }

    public MeetingDto(String meetName, String meetDescription, String meetHostId, LocalTime meetStartTime, LocalTime meetEndTime, LocalDate meetDate, String meetDuration, String meetStatus, int meetNoOfParticipants, List<String> participantsId) {
        this.meetName = meetName;
        this.meetDescription = meetDescription;
        this.meetHostId = meetHostId;
        this.meetStartTime = meetStartTime;
        this.meetEndTime = meetEndTime;
        this.meetDate = meetDate;
        this.meetDuration = meetDuration;
        this.participantsId = participantsId;
    }

    public String getMeetName() {
        return meetName;
    }

    public void setMeetName(String meetName) {
        this.meetName = meetName;
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

    public LocalTime getMeetEndTime() {
        return meetEndTime;
    }

    public void setMeetEndTime(LocalTime meetEndTime) {
        this.meetEndTime = meetEndTime;
    }

    public LocalTime getMeetStartTime() {
        return meetStartTime;
    }

    public void setMeetStartTime(LocalTime meetStartTime) {
        this.meetStartTime = meetStartTime;
    }

    public LocalDate getMeetDate() {
        return meetDate;
    }

    public void setMeetDate(LocalDate meetDate) {
        this.meetDate = meetDate;
    }

    public String getMeetDuration() {
        return meetDuration;
    }

    public void setMeetDuration(String meetDuration) {
        this.meetDuration = meetDuration;
    }

    public List<String> getParticipantsId() {
        return participantsId;
    }

    public void setParticipantsId(List<String> participantsId) {
        this.participantsId = participantsId;
    }
}
