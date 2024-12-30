package com.outpatient.service;

import com.outpatient.entity.Doctor;
import com.outpatient.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getAllDoctorsAdmin() {
        return doctorRepository.findAll();
    }
    public Doctor findByUsername(String username) {
        return doctorRepository.findByName(username).stream().findFirst().orElse(null);
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setEmail(updatedDoctor.getEmail());

        return doctorRepository.save(doctor);
    }
    public String getDoctorAvailability() {
        List<Doctor> doctors = doctorRepository.findAll();
        StringBuilder response = new StringBuilder("Available Doctors: ");
        for (Doctor doctor : doctors) {
            response.append(doctor.getName()).append(" - ");
            doctor.getAppointments().forEach(appointment -> {
                response.append("Available on ").append(appointment.getAppointmentTime()).append(", ");
            });
        }
        return response.toString();
    }
}