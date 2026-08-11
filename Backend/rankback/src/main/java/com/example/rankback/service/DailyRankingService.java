package com.example.rankback.service;

import com.example.rankback.dto.DailyRankingDTO;
import com.example.rankback.dto.DailyRankingEntryDTO;
import com.example.rankback.repository.ItemVoteRepository;
import com.example.rankback.repository.ItemVoteRepository.ItemVoteTally;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * "Gunun Siralamasi": bugun en cok oy toplayan item'lar ve dune gore sira degisimi.
 *
 * Anlik hesaplanir; ayri bir anlik goruntu tablosu veya zamanlanmis gorev yok.
 * Iki gruplama sorgusu (bugun + dun) yeterli. Veri buyudugunde gunluk anlik
 * goruntu tablosuna gecmek gerekebilir -- o zaman burasi degisir, arayuz degismez.
 */
@Service
public class DailyRankingService {

    private static final String BASLIK = "Günün Sıralaması";

    private final ItemVoteRepository itemVoteRepository;

    public DailyRankingService(ItemVoteRepository itemVoteRepository) {
        this.itemVoteRepository = itemVoteRepository;
    }

    @Transactional(readOnly = true)
    public DailyRankingDTO getDailyRanking(int limit) {
        // Gun sinirlari UTC'ye gore; kayitlar da UTC yaziliyor (bkz. LoginAuditService).
        LocalDate bugun = LocalDate.now(ZoneOffset.UTC);

        List<ItemVoteTally> bugunku = itemVoteRepository.tallyBetween(
                bugun.atStartOfDay(), bugun.plusDays(1).atStartOfDay());
        List<ItemVoteTally> dunku = itemVoteRepository.tallyBetween(
                bugun.minusDays(1).atStartOfDay(), bugun.atStartOfDay());

        Map<Integer, Integer> dunkuSiralar = siraHaritasi(dunku);

        List<DailyRankingEntryDTO> entries = new java.util.ArrayList<>();
        for (int i = 0; i < bugunku.size() && entries.size() < limit; i++) {
            ItemVoteTally satir = bugunku.get(i);
            int bugunkuSira = i + 1;
            Integer dunkuSira = dunkuSiralar.get(satir.getItemId());

            // Pozitif = yukseldi. Dun listede yoksa null birakilir; arayuz "yeni" gosterir.
            Integer delta = dunkuSira == null ? null : dunkuSira - bugunkuSira;

            entries.add(new DailyRankingEntryDTO(
                    satir.getItemId(),
                    satir.getItemName(),
                    satir.getItemImageUrl(),
                    satir.getVoteCount(),
                    delta));
        }

        return new DailyRankingDTO(bugun, BASLIK, List.copyOf(entries));
    }

    private static Map<Integer, Integer> siraHaritasi(List<ItemVoteTally> tally) {
        Map<Integer, Integer> siralar = new HashMap<>();
        for (int i = 0; i < tally.size(); i++) {
            siralar.put(tally.get(i).getItemId(), i + 1);
        }
        return siralar;
    }
}
