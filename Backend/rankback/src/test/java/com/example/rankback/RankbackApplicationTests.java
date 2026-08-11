package com.example.rankback;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Baglam ayaga kalkiyor mu kontrolu.
 *
 * "test" profili sart: profilsiz calisirsa varsayilan mysql profili devreye
 * girer ve test, paylasilan Aiven veritabanina baglanmaya calisir. O sunucu
 * erisilemez oldugunda bu test kirilirdi -- kod bozuk olmadigi halde.
 * Testler H2 uzerinde, internetten bagimsiz calismali.
 */
@SpringBootTest
@ActiveProfiles("test")
class RankbackApplicationTests {

	@Test
	void contextLoads() {
	}

}
