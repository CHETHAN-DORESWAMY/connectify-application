package com.example.employeeService.dto;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class Interval {
    ZonedDateTime startTime;
    ZonedDateTime endTime;
    List<String> employeeIds;


    public Interval(ZonedDateTime startTime, ZonedDateTime endTime, List<String> employeeIds) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.employeeIds = new ArrayList<>(employeeIds);
    }

    public ZonedDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(ZonedDateTime startTime) {
        this.startTime = startTime;
    }

    public ZonedDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(ZonedDateTime endTime) {
        this.endTime = endTime;
    }

    public List<String> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(List<String> employeeIds) {
        this.employeeIds = employeeIds;
    }

    @Override
    public String toString() {
        return "Interval{" +
                "startTime=" + startTime +
                ", endTime=" + endTime +
                ", employeeIds=" + employeeIds +
                '}';
    }
}