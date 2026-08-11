package com.example.rankback.service;

import com.example.rankback.dto.CategoryDTO;
import com.example.rankback.dto.PollCommentDTO;
import com.example.rankback.dto.PollDTO;
import com.example.rankback.dto.PollItemDTO;
import com.example.rankback.dto.PollRequest;
import com.example.rankback.entity.Category;
import com.example.rankback.entity.CustomPoll;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.PollComment;
import com.example.rankback.entity.PollItem;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.CategoryRepository;
import com.example.rankback.repository.CustomPollRepository;
import com.example.rankback.repository.ItemRepository;
import com.example.rankback.repository.PollCommentRepository;
import com.example.rankback.repository.PollItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PollService {

    private final CustomPollRepository pollRepository;
    private final PollItemRepository pollItemRepository;
    private final ItemRepository itemRepository;
    private final PollCommentRepository pollCommentRepository;
    private final CategoryRepository categoryRepository;

    public PollService(CustomPollRepository pollRepository,
                       PollItemRepository pollItemRepository,
                       ItemRepository itemRepository,
                       PollCommentRepository pollCommentRepository,
                       CategoryRepository categoryRepository) {
        this.pollRepository = pollRepository;
        this.pollItemRepository = pollItemRepository;
        this.itemRepository = itemRepository;
        this.pollCommentRepository = pollCommentRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<PollDTO> getPolls(Integer creatorId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CustomPoll> polls = creatorId == null
                ? pollRepository.findAll(pageRequest)
                : pollRepository.findByCreator_UserId(creatorId, pageRequest);
        if (polls.isEmpty()) {
            return List.of();
        }

        List<Integer> pollIds = polls.getContent().stream().map(CustomPoll::getPollId).toList();
        Map<Integer, List<PollItemDTO>> itemsByPollId = pollItemRepository.findByPoll_PollIdIn(pollIds).stream()
                .collect(Collectors.groupingBy(
                        pollItem -> pollItem.getPoll().getPollId(),
                        Collectors.mapping(PollService::toDTO, Collectors.toList())));

        // Yorumlar liste ekraninda gosterilmiyor: anket basina ayri sorgu atmamak
        // icin bos birakiliyor, detayda dolduruluyor.
        return polls.getContent().stream()
                .map(poll -> toDTO(poll, itemsByPollId.getOrDefault(poll.getPollId(), List.of()), List.of()))
                .toList();
    }

    @Transactional(readOnly = true)
    public PollDTO getPoll(Integer pollId) {
        CustomPoll poll = findOrThrow(pollId);
        return toDTO(poll, getPollItems(pollId), getPollComments(pollId));
    }

    private List<PollCommentDTO> getPollComments(Integer pollId) {
        return pollCommentRepository.findByPoll_PollIdOrderByCreatedAtDesc(pollId).stream()
                .map(PollService::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PollItemDTO> getPollItems(Integer pollId) {
        findOrThrow(pollId);
        return pollItemRepository.findByPoll_PollId(pollId).stream()
                .map(PollService::toDTO)
                .toList();
    }

    @Transactional
    public PollDTO createPoll(PollRequest request, User creator) {
        CustomPoll poll = new CustomPoll();
        poll.setCreator(creator);
        // UTC: zaman damgalari tek saat kaynagindan yazilir (main'den gelen duzeltme).
        poll.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
        // applyRequest title'i da set eder; ayrica description/coverUrl/kategori/modlar.
        applyRequest(poll, request);

        CustomPoll saved = pollRepository.save(poll);
        if (request.itemIds() != null) {
            replaceItems(saved, request.itemIds());
        }
        return toDTO(saved, getPollItems(saved.getPollId()), List.of());
    }

    @Transactional
    public PollDTO updatePoll(Integer pollId, PollRequest request, User currentUser) {
        CustomPoll poll = findOrThrow(pollId);
        requireOwnerOrAdmin(poll, currentUser);

        applyRequest(poll, request);
        CustomPoll saved = pollRepository.save(poll);
        if (request.itemIds() != null) {
            replaceItems(saved, request.itemIds());
        }
        return toDTO(saved, getPollItems(pollId), getPollComments(pollId));
    }

    /** Istekteki alanlari ankete uygular. featured bilincli olarak disarida: editoryal karar. */
    private void applyRequest(CustomPoll poll, PollRequest request) {
        poll.setTitle(request.title());
        poll.setDescription(request.description());
        poll.setCoverUrl(request.coverUrl());
        poll.setCategory(request.categoryId() == null ? null : findCategoryOrThrow(request.categoryId()));
        poll.setModes(request.modes() == null ? new LinkedHashSet<>() : new LinkedHashSet<>(request.modes()));
    }

    @Transactional
    public void deletePoll(Integer pollId, User currentUser) {
        CustomPoll poll = findOrThrow(pollId);
        requireOwnerOrAdmin(poll, currentUser);
        pollRepository.delete(poll);
    }

    @Transactional
    public List<PollItemDTO> addPollItem(Integer pollId, Integer itemId, User currentUser) {
        CustomPoll poll = findOrThrow(pollId);
        requireOwnerOrAdmin(poll, currentUser);

        if (!pollItemRepository.existsByPoll_PollIdAndItem_ItemId(pollId, itemId)) {
            pollItemRepository.save(link(poll, findItemOrThrow(itemId)));
        }
        return getPollItems(pollId);
    }

    @Transactional
    public List<PollItemDTO> removePollItem(Integer pollId, Integer itemId, User currentUser) {
        CustomPoll poll = findOrThrow(pollId);
        requireOwnerOrAdmin(poll, currentUser);

        PollItem existing = pollItemRepository.findByPoll_PollIdAndItem_ItemId(pollId, itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll " + pollId + " does not contain item " + itemId));
        pollItemRepository.delete(existing);
        return getPollItems(pollId);
    }

    private void replaceItems(CustomPoll poll, List<Integer> itemIds) {
        pollItemRepository.deleteAll(pollItemRepository.findByPoll_PollId(poll.getPollId()));
        // Hibernate flushes inserts before deletes, which would trip the (poll_id, item_id)
        // unique constraint when an item is kept, so the removals have to land first.
        pollItemRepository.flush();

        List<PollItem> links = itemIds.stream()
                .distinct()
                .map(itemId -> link(poll, findItemOrThrow(itemId)))
                .toList();
        pollItemRepository.saveAll(links);
    }

    private PollItem link(CustomPoll poll, Item item) {
        PollItem pollItem = new PollItem();
        pollItem.setPoll(poll);
        pollItem.setItem(item);
        return pollItem;
    }

    private void requireOwnerOrAdmin(CustomPoll poll, User currentUser) {
        boolean isOwner = poll.getCreator().getUserId().equals(currentUser.getUserId());
        if (!isOwner && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You can only modify your own polls");
        }
    }

    private CustomPoll findOrThrow(Integer pollId) {
        return pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found: " + pollId));
    }

    private Item findItemOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private Category findCategoryOrThrow(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }

    private static PollDTO toDTO(CustomPoll poll, List<PollItemDTO> items, List<PollCommentDTO> comments) {
        Category category = poll.getCategory();
        return new PollDTO(
                poll.getPollId(),
                poll.getTitle(),
                poll.getDescription(),
                poll.getCoverUrl(),
                category == null ? null : new CategoryDTO(
                        category.getCategoryId(), category.getName(), category.getTagline(), category.getImageUrl()),
                Boolean.TRUE.equals(poll.getFeatured()),
                poll.getModes() == null ? List.of() : List.copyOf(poll.getModes()),
                poll.getGlobalScore(),
                poll.getTotalRatings(),
                poll.getPlayCount(),
                poll.getCreator().getUserId(),
                poll.getCreator().getUsername(),
                poll.getCreatedAt(),
                items,
                comments);
    }

    private static PollCommentDTO toDTO(PollComment comment) {
        User author = comment.getUser();
        return new PollCommentDTO(
                comment.getCommentId(),
                author.getUserId(),
                author.getUsername(),
                comment.getBody(),
                comment.getScore(),
                comment.getCreatedAt());
    }

    private static PollItemDTO toDTO(PollItem pollItem) {
        Item item = pollItem.getItem();
        return new PollItemDTO(
                pollItem.getId(),
                item.getItemId(),
                item.getName(),
                item.getImageUrl(),
                item.getDescription(),
                item.getGlobalScore(),
                item.getTotalVotes());
    }
}
