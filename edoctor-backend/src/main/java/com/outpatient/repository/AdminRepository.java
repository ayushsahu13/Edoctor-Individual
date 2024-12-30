// src/main/java/com/outpatient/repository/AdminRepository.java
package com.outpatient.repository;

import com.outpatient.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
}
