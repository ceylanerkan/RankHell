package com.example.rankback.repository;

import com.example.rankback.entity.UserLoginLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLoginLogRepository extends JpaRepository<UserLoginLog, Long> {

    @EntityGraph(attributePaths = "user")
    Page<UserLoginLog> findByUser_UserIdOrderByLoginTimeDesc(Integer userId, Pageable pageable);

    @EntityGraph(attributePaths = "user")
    Page<UserLoginLog> findAllByOrderByLoginTimeDesc(Pageable pageable);

    /** Sadece başarılı (true) veya sadece başarısız (false) denemeler. */
    @EntityGraph(attributePaths = "user")
    Page<UserLoginLog> findBySuccessOrderByLoginTimeDesc(boolean success, Pageable pageable);
}
