package com.example.employeeService.dao;

import com.example.employeeService.entity.EmployeeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeDao extends MongoRepository<EmployeeEntity, String> {
}
