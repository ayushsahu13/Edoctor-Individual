package com.outpatient.controller;

import com.outpatient.entity.Doctor;
import com.outpatient.repository.DoctorRepository;
import com.outpatient.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;


    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        Doctor registeredDoctor = doctorService.addDoctor(doctor);
        return new ResponseEntity<>(registeredDoctor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }

    @DeleteMapping("/{doctorId}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long doctorId) {
        doctorService.deleteDoctor(doctorId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
    }

    // Get all doctors
    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctorsAdmin() {
        List<Doctor> doctors = doctorRepository.findAll();
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor updatedDoctor) {
        Doctor doctor = doctorService.updateDoctor(id, updatedDoctor);
        return ResponseEntity.ok(doctor);
    }
    // Add a new doctor
    @PostMapping("/add")
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(savedDoctor);
    }
}