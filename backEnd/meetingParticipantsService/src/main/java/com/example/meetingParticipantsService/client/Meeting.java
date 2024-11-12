package com.example.meetingParticipantsService.client;

import java.time.LocalDateTime;

public class Meeting {

    String meetId;
    String meetName;
    String meetDescription;
    String meetHostId;
    LocalDateTime meetStartDateTime;
    LocalDateTime meetEndDateTime;
    String meetDuration;
    String meetStatus;
    int meetNoOfParticipants;
}
