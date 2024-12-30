package com.outpatient.service;

import com.outpatient.entity.User;
import com.outpatient.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User addAdmin(User admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ADMIN");
        return userRepository.save(admin);
    }

    public List<User> getAllAdmins() {
        return userRepository.findByRole("ADMIN");
    }

    public void deleteAdmin(Long id) {
        userRepository.deleteById(id);
    }
}
