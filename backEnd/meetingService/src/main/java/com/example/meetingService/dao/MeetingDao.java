package com.example.meetingService.dao;

import com.example.meetingService.entity.MeetingEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingDao extends MongoRepository<MeetingEntity, String> {
    List<MeetingEntity> findByMeetingDateAndMeetIdIn(LocalDate date, List<String> ids);
}
