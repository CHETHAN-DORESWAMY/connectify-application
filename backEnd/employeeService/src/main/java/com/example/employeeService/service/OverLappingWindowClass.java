package com.example.employeeService.service;

import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.dto.EmployeeListDto;
import com.example.employeeService.entity.EmployeeEntity;
import com.example.employeeService.entity.OverlapWindow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OverLappingWindowClass {

    @Autowired
    private EmployeeDao employeeDao;

    public Map<String, Object> computeWindow(EmployeeListDto employeeListDto){
//        it will find the list of selected employee form the database
        LocalDate meetingDate = employeeListDto.getMeetingDate();
        List<EmployeeEntity> employees = employeeDao.findByEmpIdIn(employeeListDto.getListOfEmployeeId());
        Map<String, Object> response = new HashMap<>();

        OverlapWindow overlap = findOverlap(employees);
        response.put("Green", adjustWindowDate(overlap, meetingDate));


        employees = extendWorkTimes(employees, 3); // Extend by ±3 hours
        OverlapWindow overlap1 = findOverlap(employees);
        response.put("amber", adjustWindowDate(overlap1, meetingDate));

        return response;






    }
    public OverlapWindow adjustWindowDate(OverlapWindow overlap, LocalDate meetingDate){
        if (overlap != null) {
            ZonedDateTime overlapStart = adjustOverlapDateTime(overlap.getOverlapStart(), meetingDate);
            ZonedDateTime overlapEnd = adjustOverlapDateTime(overlap.getOverlapEnd(), meetingDate);

            return new OverlapWindow(overlapStart, overlapEnd);
        } else {
            return null; // No overlap even after extension
        }
    }

    //logic to find the overlapping window
    private OverlapWindow findOverlap(List<EmployeeEntity> employees) {
        ZonedDateTime maxStartTime = ZonedDateTime.of(LocalDate.now(), LocalTime.MIN, ZoneOffset.UTC);
        ZonedDateTime minEndTime = ZonedDateTime.of(LocalDate.now(), LocalTime.MAX, ZoneOffset.UTC);
        boolean extendsToNextDay = false;

        for (EmployeeEntity emp : employees) {
            ZoneId zone = ZoneId.of(emp.getEmpTimezone());

            // Convert LocalTime to LocalDateTime by combining with today's date and then into ZonedDateTime
            ZonedDateTime start = ZonedDateTime.of(LocalDateTime.of(LocalDate.now(), emp.getEmpStartTime()), zone);
            ZonedDateTime end = ZonedDateTime.of(LocalDateTime.of(LocalDate.now(), emp.getEmpEndTime()), zone);

            //convert zonedDateTime to UTC time
            ZonedDateTime startUtc = start.withZoneSameInstant(ZoneOffset.UTC);
            ZonedDateTime endUtc = end.withZoneSameInstant(ZoneOffset.UTC);

            // Adjust maxStartTime and minEndTime based on UTC times
            if (startUtc.isAfter(maxStartTime)) {
                maxStartTime = startUtc;
            }
            if (endUtc.isBefore(minEndTime)) {
                minEndTime = endUtc;
            }

            // Check if the window extends to the next day (if the start is after the end time)
            if (startUtc.isAfter(endUtc)) {
                extendsToNextDay = true;
            }
        }

        // If there's overlap, return the result
        if (maxStartTime.isBefore(minEndTime)) {
            return new OverlapWindow(maxStartTime, minEndTime);
        } else {
            return null; // No overlap
        }
    }

    private List<EmployeeEntity> extendWorkTimes(List<EmployeeEntity> employees, int hours) {
        for (EmployeeEntity emp : employees) {
            emp.setEmpStartTime(emp.getEmpStartTime().minusHours(hours));
            emp.setEmpEndTime(emp.getEmpEndTime().plusHours(hours));
        }
        return employees;
    }

    private ZonedDateTime adjustOverlapDateTime(ZonedDateTime overlapDateTime, LocalDate meetingDate) {
        // Ensure that the given ZonedDateTime corresponds to the correct meeting date (if not already)
        ZonedDateTime dateTime = overlapDateTime.withYear(meetingDate.getYear())
                .withMonth(meetingDate.getMonthValue())
                .withDayOfMonth(meetingDate.getDayOfMonth());

        // Check if the overlapDateTime crosses into the next or previous day
        if (overlapDateTime.toLocalTime().isAfter(LocalTime.MAX.minusHours(3))) {
            // Adjust date if the window crosses into the next day
            dateTime = dateTime.plusDays(1);
        } else if (overlapDateTime.toLocalTime().isBefore(LocalTime.MIN.plusHours(3))) {
            // Adjust date if the window crosses into the previous day
            dateTime = dateTime.minusDays(1);
        }

        return dateTime;
    }



}
