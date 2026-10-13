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
    public ResponseEntity<?> enrollStudent(@RequestBody Enrollment enrollment) {
        if (enrollment.getStudent() == null || enrollment.getCourse() == null) {
            return ResponseEntity.badRequest().body("Student and Course must be specified.");
        }

        Long studentId = enrollment.getStudent().getId();
        Long courseId = enrollment.getCourse().getId();

        Student student = studentRepository.findById(studentId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);

        if (student == null || course == null) {
            return ResponseEntity.badRequest().body("Specified student or course does not exist.");
        }

        enrollment.setStudent(student);
        enrollment.setCourse(course);
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