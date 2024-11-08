package com.example.meetingService.dao;

import com.example.meetingService.entity.MeetingEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingDao extends MongoRepository<MeetingEntity, String> {
}
