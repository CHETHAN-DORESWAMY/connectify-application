package com.example.employeeService.controller;

import com.example.employeeService.entity.EmployeeEntity;
import com.example.employeeService.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // Create a new employee
    @PostMapping("/add")
    public ResponseEntity<HashMap<String, Object>> createEmployee(@RequestBody EmployeeEntity employeeEntity) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            EmployeeEntity createdEmployee = employeeService.createEmployee(employeeEntity);
            response.put("message", "Employee created successfully");
            response.put("employee", createdEmployee);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            response.put("message", "Error creating employee");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all employees
    @GetMapping("/getAll")
    public ResponseEntity<HashMap<String, Object>> getAllEmployees() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            List<EmployeeEntity> employees = employeeService.getAllEmployees();
            response.put("message", "Employees fetched successfully");
            response.put("employees", employees);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("message", "Error fetching employees");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get employee by ID
    @GetMapping("/get/{empId}")
    public ResponseEntity<HashMap<String, Object>> getEmployeeById(@PathVariable String empId) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<EmployeeEntity> employee = employeeService.getEmployeeById(empId);
            if (employee.isPresent()) {
                response.put("message", "Employee found");
                response.put("employee", employee.get());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Employee not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error fetching employee");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update employee by ID
    @PutMapping("/update/{empId}")
    public ResponseEntity<HashMap<String, Object>> updateEmployee(@PathVariable String empId, @RequestBody EmployeeEntity updatedEmployee) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            EmployeeEntity employee = employeeService.updateEmployee(empId, updatedEmployee);
            if (employee != null) {
                response.put("message", "Employee updated successfully");
                response.put("employee", employee);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("message", "Employee not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("message", "Error updating employee");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete employee by ID
    @DeleteMapping("/delete/{empId}")
    public ResponseEntity<HashMap<String, Object>> deleteEmployee(@PathVariable String empId) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            employeeService.deleteEmployee(empId);
            response.put("message", "Employee deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            response.put("message", "Error deleting employee");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
