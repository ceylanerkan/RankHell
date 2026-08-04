package com.example.rankback.service;

import com.example.rankback.entity.User;
import com.example.rankback.entity.UserLoginLog;
import com.example.rankback.repository.UserLoginLogRepository;
import com.example.rankback.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * user_login_logs tablosuna yazan tek nokta.
 *
 * <p>AuthService'ten ayrı bir bean olmasının sebebi teknik: Spring'in
 * {@code @Transactional} desteği proxy tabanlıdır, bir sınıf kendi metodunu
 * çağırdığında (self-invocation) proxy devreye girmez ve propagation ayarı
 * yok sayılırdı. Başarısız giriş kaydının kendi transaction'ında commit
 * edilebilmesi için çağrının başka bir bean üzerinden geçmesi şart.
 */
@Service
public class LoginAuditService {

    private static final int MAX_EMAIL_LENGTH = 100; // attempted_email kolonuyla aynı

    private final UserLoginLogRepository userLoginLogRepository;
    private final UserRepository userRepository;

    public LoginAuditService(UserLoginLogRepository userLoginLogRepository, UserRepository userRepository) {
        this.userLoginLogRepository = userLoginLogRepository;
        this.userRepository = userRepository;
    }

    /**
     * Başarılı giriş/kayıt. REQUIRED (varsayılan): çağıranın transaction'ına katılır.
     * Kayıt (register) akışında bu bilinçlidir: kullanıcı oluşturma geri alınırsa
     * log da geri alınmalıdır, yoksa var olmayan bir kullanıcıya FK veren satır kalırdı.
     */
    @Transactional
    public void recordSuccess(User user, String ipAddress) {
        save(user, user.getEmail(), ipAddress, true);
    }

    /**
     * Başarısız giriş denemesi. REQUIRES_NEW şart: çağıran taraf birazdan
     * BadCredentialsException fırlatacağı için onun transaction'ı geri alınacak.
     * Ayrı bir transaction'da commit edilmezse, kaydetmeye çalıştığımız
     * başarısızlık kaydı da rollback ile birlikte silinirdi.
     *
     * <p>E-posta bilinen bir kullanıcıya aitse (parola hatası) satır o kullanıcıya
     * bağlanır; tanınmayan bir e-posta denenmişse user null kalır.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailure(String attemptedEmail, String ipAddress) {
        User user = (attemptedEmail == null || attemptedEmail.isBlank())
                ? null
                : userRepository.findByEmail(attemptedEmail).orElse(null);
        save(user, attemptedEmail, ipAddress, false);
    }

    private void save(User user, String email, String ipAddress, boolean success) {
        userLoginLogRepository.save(UserLoginLog.builder()
                .user(user)
                .attemptedEmail(truncate(email))
                // UTC olarak saklanır: sunucu saat dilimi değişse de kayıtlar
                // karşılaştırılabilir kalsın diye JVM varsayılan bölgesi kullanılmıyor.
                .loginTime(LocalDateTime.now(ZoneOffset.UTC))
                .ipAddress(ipAddress)
                .success(success)
                .build());
    }

    /** Kolon sınırını aşan bir e-posta denemesi audit yazımını patlatmasın. */
    private static String truncate(String email) {
        if (email == null) {
            return null;
        }
        return email.length() <= MAX_EMAIL_LENGTH ? email : email.substring(0, MAX_EMAIL_LENGTH);
    }
}
