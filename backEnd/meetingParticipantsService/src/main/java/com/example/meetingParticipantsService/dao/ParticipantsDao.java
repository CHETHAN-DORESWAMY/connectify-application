package com.example.meetingParticipantsService.dao;

import com.example.meetingParticipantsService.entity.ParticipantsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ParticipantsDao extends MongoRepository<ParticipantsEntity, String> {

//    @Query("SELECT p.meetId FROM ParticipantsEntity p WHERE p.empId = :participantId")
//    List<String> findMeetIdByEmpId(@Param("participantId") String participantId);

    List<ParticipantsEntity> findByEmpId(String participantId);

    List<ParticipantsEntity> findByMeetId(String meetId);

    ParticipantsEntity findByEmpIdAndMeetId(String empId, String meetId);
}
