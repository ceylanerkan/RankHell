package com.example.rankback.repository;

import com.example.rankback.entity.UserLoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLoginLogRepository extends JpaRepository<UserLoginLog, Long> {
}
