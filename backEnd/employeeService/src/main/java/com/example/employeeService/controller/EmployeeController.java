package com.example.employeeService.controller;

import com.example.employeeService.dto.EmployeeListDto;
import com.example.employeeService.dto.Interval;
import com.example.employeeService.dto.TimeClass;
import com.example.employeeService.entity.EmployeeEntity;
import com.example.employeeService.entity.OverlapWindow;
import com.example.employeeService.service.EmployeeService;
import com.example.employeeService.service.OverLappingWindowAlgorithm;
import com.example.employeeService.service.OverLappingWindowClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private OverLappingWindowClass overLappingWindowClass;

    @Autowired
    private OverLappingWindowAlgorithm overLappingWindowAlgorithm;

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

    @GetMapping("/get-by-email/{email}")
    public ResponseEntity<HashMap<String, Object>> getEmployeeByEmail(@PathVariable String email) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Optional<EmployeeEntity> employee = employeeService.getEmployeeByEmail(email);
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

    @PostMapping("/get-window-time")
    public ResponseEntity<List<TimeClass>> computeWindowTime(@RequestBody EmployeeListDto employeeListDto){
        System.out.println(employeeListDto.getListOfEmployeeId());
        System.out.println(employeeListDto.getMeetingDate());

        List<TimeClass> list = overLappingWindowClass.computeWindow(employeeListDto);
        System.out.println("Start Time" + list.get(0).getStartTime());
        System.out.println("end Time" + list.get(0).getEndTime());


        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/get-red-window")
    public ResponseEntity<List<Interval>>  computeRedWindowTime(@RequestBody EmployeeListDto employeeListDto){
        System.out.println(employeeListDto.getListOfEmployeeId());
        System.out.println(employeeListDto.getMeetingDate());

        List<Interval> list = overLappingWindowAlgorithm.computeWindow(employeeListDto);
        System.out.println("Start Time" + list.get(0).getStartTime());
        System.out.println("end Time" + list.get(0).getEndTime());


        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/get-employee-by-ids")
    public ResponseEntity<List<EmployeeEntity>> getEmployeeByIds(@RequestBody List<String> ids){
        return new ResponseEntity<>(employeeService.getAllEmployeesByIds(ids), HttpStatus.OK);
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
