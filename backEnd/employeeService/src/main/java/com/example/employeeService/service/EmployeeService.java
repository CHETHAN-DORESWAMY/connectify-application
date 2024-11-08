package com.example.employeeService.service;

import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao employeeDao;

    // Create a new employee
    public EmployeeEntity createEmployee(EmployeeEntity employeeEntity) {
        return employeeDao.save(employeeEntity);
    }

    // Get all employees
    public List<EmployeeEntity> getAllEmployees() {
        return employeeDao.findAll();
    }

    // Get employee by ID
    public Optional<EmployeeEntity> getEmployeeById(String empId) {
        return employeeDao.findById(empId);
    }

    // Update an employee
    public EmployeeEntity updateEmployee(String empId, EmployeeEntity updatedEmployee) {
        Optional<EmployeeEntity> existingEmployee = employeeDao.findById(empId);
        if (existingEmployee.isPresent()) {
            EmployeeEntity employee = existingEmployee.get();
            // Update fields
            employee.setEmpName(updatedEmployee.getEmpName());
            employee.setEmpDesignation(updatedEmployee.getEmpDesignation());
            employee.setEmpEmail(updatedEmployee.getEmpEmail());
            employee.setEmpPhone(updatedEmployee.getEmpPhone());
            employee.setEmpCity(updatedEmployee.getEmpCity());
            employee.setEmpTimezone(updatedEmployee.getEmpTimezone());
            employee.setEmpStartTime(updatedEmployee.getEmpStartTime());
            employee.setEmpEndTime(updatedEmployee.getEmpEndTime());
            return employeeDao.save(employee);
        }
        return null;
    }

    // Delete an employee by ID
    public void deleteEmployee(String empId) {
        employeeDao.deleteById(empId);
    }

    public Optional<EmployeeEntity> getEmployeeByEmail(String email) {
        return employeeDao.findByEmpEmail(email);
    }


    public Optional<TimeInterval> computeWindowTime(List<String> employeesId) {
        List<EmployeeEntity> employees = employeeDao.findByEmpIdIn(employeesId);

        List<TimeInterval> employeeIntervals = employees.stream()
                .map(employee -> {
                    int startMinutes = convertToUTCMins(employee.getEmpStartTime(), employee.getEmpTimezone());
                    int endMinutes = convertToUTCMins(employee.getEmpEndTime(), employee.getEmpTimezone());
                    return new TimeInterval(startMinutes, endMinutes);
                })
                .toList();

        int commonStart = employeeIntervals.stream().mapToInt(interval -> interval.start).max().orElse(-1);
        int commonEnd = employeeIntervals.stream().mapToInt(interval -> interval.end).min().orElse(-1);

        if (commonStart < commonEnd) {
            return Optional.of(new TimeInterval(commonStart, commonEnd));
        } else {
            return Optional.empty();
        }


    }

    private int convertToUTCMins(LocalDateTime dateTime, String timezone) {
        ZonedDateTime zonedDateTime = dateTime.atZone(ZoneId.of(timezone));
        ZonedDateTime utcDateTime = zonedDateTime.withZoneSameInstant(ZoneOffset.UTC);
        return utcDateTime.getHour() * 60 + utcDateTime.getMinute();
    }

    public static class TimeInterval {
        int start;
        int end;

        public TimeInterval(int start, int end) {
            this.start = start;
            this.end = end;
        }

        public LocalTime getStartTimeInUTC() {
            return LocalTime.of(start / 60, start % 60);
        }

        public LocalTime getEndTimeInUTC() {
            return LocalTime.of(end / 60, end % 60);
        }
    }
}

