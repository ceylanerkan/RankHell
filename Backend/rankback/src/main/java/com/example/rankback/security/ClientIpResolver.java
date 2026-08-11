package com.example.rankback.security;

import jakarta.servlet.http.HttpServletRequest;

/**
 * İstemcinin IP adresini çözer.
 *
 * <p>Uygulama bir reverse proxy (nginx, cloud load balancer) arkasındaysa
 * {@code getRemoteAddr()} proxy'nin IP'sini döner; gerçek istemci IP'si
 * {@code X-Forwarded-For} başlığının ilk elemanındadır.
 *
 * <p>DİKKAT: {@code X-Forwarded-For} istemci tarafından taklit edilebilir.
 * Yalnızca bu başlığı ezen güvenilir bir proxy arkasında anlamlıdır;
 * doğrudan internete açık bir kurulumda bu değere güvenilmemelidir.
 */
public final class ClientIpResolver {

    private static final String FORWARDED_HEADER = "X-Forwarded-For";
    private static final int MAX_LENGTH = 45; // IPv6 için yeterli, ip_address kolonuyla aynı
    private static final String UNKNOWN = "unknown";

    private ClientIpResolver() {
    }

    public static String resolve(HttpServletRequest request) {
        String forwarded = request.getHeader(FORWARDED_HEADER);
        if (forwarded != null && !forwarded.isBlank()) {
            // "client, proxy1, proxy2" -> ilk eleman gerçek istemcidir
            String client = forwarded.split(",")[0].trim();
            if (!client.isEmpty()) {
                return truncate(client);
            }
        }

        String remote = request.getRemoteAddr();
        return (remote == null || remote.isBlank()) ? UNKNOWN : truncate(remote);
    }

    private static String truncate(String value) {
        return value.length() <= MAX_LENGTH ? value : value.substring(0, MAX_LENGTH);
    }
}
