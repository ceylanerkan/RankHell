package com.example.rankback.service;

import com.example.rankback.dto.DuelDTO;
import com.example.rankback.dto.DuelRequest;
import com.example.rankback.dto.DuelSideDTO;
import com.example.rankback.entity.Duel;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.DuelRepository;
import com.example.rankback.repository.ItemRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class DuelService {

    private final DuelRepository duelRepository;
    private final ItemRepository itemRepository;

    public DuelService(DuelRepository duelRepository, ItemRepository itemRepository) {
        this.duelRepository = duelRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<DuelDTO> getDuels(int page, int size) {
        return duelRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .getContent().stream()
                .map(DuelService::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public DuelDTO getDuel(Integer duelId) {
        return toDTO(findOrThrow(duelId));
    }

    @Transactional
    public DuelDTO createDuel(DuelRequest request, User creator) {
        if (request.itemAId().equals(request.itemBId())) {
            throw new IllegalArgumentException("A duel needs two different items");
        }

        Duel duel = new Duel();
        duel.setTitle(request.title());
        duel.setItemA(findItemOrThrow(request.itemAId()));
        duel.setItemB(findItemOrThrow(request.itemBId()));
        duel.setCreator(creator);
        duel.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
        return toDTO(duelRepository.save(duel));
    }

    /**
     * Anonim oy. Kimlik sorulmadigi icin ayni kisinin tekrar oy vermesini sunucu
     * engelleyemez; arayuz oy hakkini localStorage'da tutuyor. Bu bilincli bir
     * tercih: widget'in isi ziyaretciyi yakalamak, giris duvari onu oldururdu.
     */
    @Transactional
    public DuelDTO vote(Integer duelId, String side) {
        int guncellenen = "A".equals(side)
                ? duelRepository.incrementVotesA(duelId)
                : duelRepository.incrementVotesB(duelId);

        if (guncellenen == 0) {
            throw new ResourceNotFoundException("Duel not found: " + duelId);
        }
        return toDTO(findOrThrow(duelId));
    }

    @Transactional
    public void deleteDuel(Integer duelId, User currentUser) {
        Duel duel = findOrThrow(duelId);
        boolean isOwner = duel.getCreator().getUserId().equals(currentUser.getUserId());
        if (!isOwner && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You can only delete your own duels");
        }
        duelRepository.delete(duel);
    }

    private Duel findOrThrow(Integer duelId) {
        return duelRepository.findWithSidesByDuelId(duelId)
                .orElseThrow(() -> new ResourceNotFoundException("Duel not found: " + duelId));
    }

    private Item findItemOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private static DuelDTO toDTO(Duel duel) {
        User creator = duel.getCreator();
        return new DuelDTO(
                duel.getDuelId(),
                duel.getTitle(),
                toSideDTO(duel.getItemA()),
                toSideDTO(duel.getItemB()),
                duel.getVotesA() == null ? 0 : duel.getVotesA(),
                duel.getVotesB() == null ? 0 : duel.getVotesB(),
                creator.getUserId(),
                creator.getUsername(),
                duel.getCreatedAt());
    }

    private static DuelSideDTO toSideDTO(Item item) {
        return new DuelSideDTO(item.getItemId(), item.getName(), item.getImageUrl());
    }
}
