package com.example.employeeService.service;

import com.example.employeeService.dao.EmployeeDao;
import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
}

