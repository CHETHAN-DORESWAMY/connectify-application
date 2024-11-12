package com.example.meetingParticipantsService.dto;

import java.util.List;

public class ParticipantsDto {
    private List<String> participantsIds;
    private String meetingId;

    public ParticipantsDto(List<String> participantsIds, String meetingId) {
        this.participantsIds = participantsIds;
        this.meetingId = meetingId;
    }

    public List<String> getParticipantsIds() {
        return participantsIds;
    }

    public void setParticipantsIds(List<String> participantsIds) {
        this.participantsIds = participantsIds;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }
}
