package com.outpatient.controller;

import com.outpatient.entity.Appointment;
import com.outpatient.entity.User;
import com.outpatient.repository.UserRepository;
import com.outpatient.service.AdminService;
import com.outpatient.service.AppointmentService;
import com.outpatient.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:3000") // Update with your frontend URL
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService; // User management

    @Autowired
    private AppointmentService appointmentService;

    // Add a new admin
    @PostMapping("/add")
    public ResponseEntity<User> addAdmin(@RequestBody User admin) {
        admin.setRole("ADMIN");
        admin.setPassword(passwordEncoder.encode(admin.getPassword())); // Encode password
        return ResponseEntity.ok(adminService.addAdmin(admin));
    }

    // Get all admins
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // Delete admin by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Basic ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String base64Credentials = authorizationHeader.substring("Basic ".length());
        byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(decodedBytes);
        String[] values = credentials.split(":", 2);

        String username = values[0];
        String password = values[1];

        // Verify admin credentials
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        if (!passwordEncoder.matches(password, admin.getPassword()) || !"ADMIN".equals(admin.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok("Admin login successful");
    }
    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Add a new user
    @PostMapping("/users/add")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.addUser(user));
    }

    // Edit an existing user
    @PutMapping("/users/edit/{id}")
    public ResponseEntity<User> editUser(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.editUser(id, userDetails));
    }

    // Delete a user
    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Get all appointments (Admin only)
    @GetMapping("/appointments/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated user: " + auth.getName());
        System.out.println("Authorities: " + auth.getAuthorities());

        List<Appointment> appointments = appointmentService.getAllAppointments();
        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(appointments);
    }
}
