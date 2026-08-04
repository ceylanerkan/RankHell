package com.example.rankback.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_login_logs")
@Data // Tüm getter, setter, toString ve equals metodlarını otomatik oluşturur
@NoArgsConstructor // Parametresiz (boş) constructor oluşturur (JPA için zorunludur)
@AllArgsConstructor // Tüm alanları içeren constructor oluşturur
@Builder // Nesneyi daha kolay oluşturmanı sağlayan Builder pattern ekler
public class UserLoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Başarısız girişlerde null olabilir: tanınmayan bir e-posta ile denenen
     * girişin bağlanacağı bir kullanıcı yoktur.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /** Denenen e-posta. Başarısız girişlerde kullanıcıyı bulmanın tek yolu budur. */
    @Size(max = 100, message = "E-posta 100 karakterden uzun olamaz")
    @Column(name = "attempted_email", length = 100)
    private String attemptedEmail;

    @NotBlank(message = "IP adresi boş olamaz")
    @Size(max = 45, message = "IP adresi 45 karakterden uzun olamaz")
    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @NotNull(message = "Giriş zamanı boş olamaz")
    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    /** true: giriş başarılı. false: kimlik doğrulama reddedildi. */
    @Column(name = "success", nullable = false)
    private boolean success;
}
