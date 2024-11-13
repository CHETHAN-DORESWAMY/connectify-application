package com.example.meetingParticipantsService.dto;

public class ParticipantsStatusDto {

    String empId;
    String status;

    public ParticipantsStatusDto(String empId, String status) {
        this.empId = empId;
        this.status = status;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
