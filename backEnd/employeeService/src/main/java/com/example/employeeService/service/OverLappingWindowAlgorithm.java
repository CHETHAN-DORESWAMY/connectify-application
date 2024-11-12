package com.example.employeeService.service;


import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.dto.EmployeeListDto;
import com.example.employeeService.dto.Interval;
import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class OverLappingWindowAlgorithm {

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private LocalToUtcConvertor localToUtcConvertor;

    public List<Interval> computeWindow(EmployeeListDto employeeListDto){
        LocalDate meetingDate = employeeListDto.getMeetingDate();
        List<EmployeeEntity> employees = employeeDao.findByEmpIdIn(employeeListDto.getListOfEmployeeId());

        return findOverlappingIntervals(employees, meetingDate);

    }
    public List<Interval> findOverlappingIntervals(List<EmployeeEntity> employees, LocalDate meetingDate) {
        List<Interval> intervals = new ArrayList<>();

        for (EmployeeEntity emp : employees) {
            List<ZonedDateTime> zonedDateTimeList = localToUtcConvertor.convert(emp, meetingDate);
            ZonedDateTime startUtc = zonedDateTimeList.get(0);
            ZonedDateTime endUtc = zonedDateTimeList.get(1);

            boolean found = false;

            for (int i = 0; i < intervals.size() && !found; i++) {
                Interval interval = intervals.get(i);

                // Check for overlap
                if (!interval.getEndTime().isBefore(startUtc) && !interval.getStartTime().isAfter(endUtc)) {
                    // Update interval start and end times to be the common overlapping period
                    interval.setStartTime(interval.getStartTime().isAfter(startUtc) ? interval.getStartTime() : startUtc);
                    interval.setEndTime(interval.getEndTime().isBefore(endUtc) ? interval.getEndTime() : endUtc);

                    // Add employee ID to the interval
                    interval.getEmployeeIds().add(emp.getEmpId());
                    found = true;
                }
            }

            // If no overlapping interval was found, add a new interval
            if (!found) {
                List<String> empList = new ArrayList<>();
                empList.add(emp.getEmpId());
                intervals.add(new Interval(startUtc, endUtc, empList));
            }
        }

        return intervals;
    }



}
