package com.example.meetingParticipantsService.dao;

import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantsDao extends MongoRepository<ParticipantsEntity, String> {
}
