package com.example.employeeService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "employee_details")
public class EmployeeEntity {

    @Id
    String empId;
    String empName;
    String empDesignation;
    String empEmail;
    String empPhone;
    String empCity;
    String empTimezone;
    LocalDateTime empStartTime;
    LocalDateTime empEndTime;

    public EmployeeEntity() {
    }

    public EmployeeEntity(String empId, String empName, String empDesignation, String empEmail, String empPhone, String empCity, String empTimezone, LocalDateTime empStartTime, LocalDateTime empEndTime) {
        this.empId = empId;
        this.empName = empName;
        this.empDesignation = empDesignation;
        this.empEmail = empEmail;
        this.empPhone = empPhone;
        this.empCity = empCity;
        this.empTimezone = empTimezone;
        this.empStartTime = empStartTime;
        this.empEndTime = empEndTime;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getEmpDesignation() {
        return empDesignation;
    }

    public void setEmpDesignation(String empDesignation) {
        this.empDesignation = empDesignation;
    }

    public String getEmpEmail() {
        return empEmail;
    }

    public void setEmpEmail(String empEmail) {
        this.empEmail = empEmail;
    }

    public String getEmpPhone() {
        return empPhone;
    }

    public void setEmpPhone(String empPhone) {
        this.empPhone = empPhone;
    }

    public String getEmpCity() {
        return empCity;
    }

    public void setEmpCity(String empCity) {
        this.empCity = empCity;
    }

    public String getEmpTimezone() {
        return empTimezone;
    }

    public void setEmpTimezone(String empTimezone) {
        this.empTimezone = empTimezone;
    }

    public LocalDateTime getEmpStartTime() {
        return empStartTime;
    }

    public void setEmpStartTime(LocalDateTime empStartTime) {
        this.empStartTime = empStartTime;
    }

    public LocalDateTime getEmpEndTime() {
        return empEndTime;
    }

    public void setEmpEndTime(LocalDateTime empEndTime) {
        this.empEndTime = empEndTime;
    }
}
