package com.example.backend.controller;

import com.example.backend.model.Course;
import com.example.backend.model.Enrollment;
import com.example.backend.model.Student;
import com.example.backend.repository.CourseRepository;
import com.example.backend.repository.EnrollmentRepository;
import com.example.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Enrollment> getEnrollments() {
        return enrollmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> enrollStudent(@RequestBody Map<String, Object> payload) {
        String rollNo = payload.get("rollNo") != null ? payload.get("rollNo").toString() : null;
        String courseCode = payload.get("courseCode") != null ? payload.get("courseCode").toString() : null;
        String grade = payload.get("grade") != null ? payload.get("grade").toString() : "A";

        if (rollNo == null || courseCode == null) {
            return ResponseEntity.badRequest().body("Both Roll No and Course Code are required.");
        }

        Optional<Student> studentOpt = studentRepository.findByRollNo(rollNo.trim());
        Optional<Course> courseOpt = courseRepository.findByCode(courseCode.trim());

        if (studentOpt.isEmpty() || courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student or Course not found.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setRollNo(studentOpt.get().getRollNo());
        enrollment.setCourseCode(courseOpt.get().getCode());
        enrollment.setStudent(studentOpt.get());
        enrollment.setCourse(courseOpt.get());
        enrollment.setGrade(grade);

        return ResponseEntity.ok(enrollmentRepository.save(enrollment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(@PathVariable Long id) {
        if (enrollmentRepository.existsById(id)) {
            enrollmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}