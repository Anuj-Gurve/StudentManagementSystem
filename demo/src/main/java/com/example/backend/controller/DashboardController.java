package com.example.backend.controller;

import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.EnrollmentRepository;
import com.example.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping("/summary")
    public Map<String, Long> getMetrics() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("totalStudents", studentRepository.count());
        counts.put("totalCourses", courseRepository.count());
        counts.put("totalEnrollments", enrollmentRepository.count());
        return counts;
    }
}