package com.outpatient.repository;

import com.outpatient.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    //User findByUsername(String username);

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);


    Optional<User> findByResetToken(String resetToken);
    List<User> findByRole(String role);

}