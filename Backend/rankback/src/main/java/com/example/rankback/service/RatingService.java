package com.example.rankback.service;

import com.example.rankback.dto.RatingDTO;
import com.example.rankback.dto.RatingSummaryDTO;
import com.example.rankback.dto.UserRatingDTO;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.Rating;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.ItemRepository;
import com.example.rankback.repository.RatingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ItemRepository itemRepository;

    public RatingService(RatingRepository ratingRepository, ItemRepository itemRepository) {
        this.ratingRepository = ratingRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public RatingSummaryDTO getSummary(Integer itemId, Integer currentUserId) {
        findItemOrThrow(itemId);
        Byte myScore = currentUserId == null
                ? null
                : ratingRepository.findByUser_UserIdAndItem_ItemId(currentUserId, itemId)
                        .map(Rating::getScore)
                        .orElse(null);
        return summary(itemId, myScore);
    }

    @Transactional(readOnly = true)
    public List<RatingDTO> getItemRatings(Integer itemId, int page, int size) {
        findItemOrThrow(itemId);
        return ratingRepository
                .findByItem_ItemId(itemId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(RatingService::toDTO)
                .toList();
    }

    /** Bir kullanicinin verdigi tum puanlar. Sadece kendisi veya admin gorebilir. */
    @Transactional(readOnly = true)
    public List<UserRatingDTO> getUserRatings(Integer userId, User currentUser, int page, int size) {
        if (!currentUser.getUserId().equals(userId) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You can only access your own ratings");
        }
        return ratingRepository
                .findByUser_UserId(userId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(RatingService::toUserRatingDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public RatingDTO getMyRating(Integer itemId, Integer currentUserId) {
        findItemOrThrow(itemId);
        return ratingRepository.findByUser_UserIdAndItem_ItemId(currentUserId, itemId)
                .map(RatingService::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("No rating for item: " + itemId));
    }

    /**
     * Upsert: one rating per user per item, re-rating overwrites the previous score.
     */
    @Transactional
    public RatingSummaryDTO rate(Integer itemId, Byte score, User user) {
        Item item = findItemOrThrow(itemId);
        Optional<Rating> existing = ratingRepository.findByUser_UserIdAndItem_ItemId(user.getUserId(), itemId);

        Rating rating = existing.orElseGet(() -> {
            Rating created = new Rating();
            created.setItem(item);
            created.setUser(user);
            created.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));
            return created;
        });
        rating.setScore(score);
        ratingRepository.save(rating);

        refreshAggregates(item);
        return summary(itemId, score);
    }

    @Transactional
    public RatingSummaryDTO deleteRating(Integer itemId, User user) {
        Item item = findItemOrThrow(itemId);
        Rating rating = ratingRepository.findByUser_UserIdAndItem_ItemId(user.getUserId(), itemId)
                .orElseThrow(() -> new ResourceNotFoundException("No rating for item: " + itemId));
        ratingRepository.delete(rating);

        refreshAggregates(item);
        return summary(itemId, null);
    }

    /** Keeps globalScore / totalVotes on Items in sync with the Ratings rows. */
    private void refreshAggregates(Item item) {
        item.setGlobalScore(averageScore(item.getItemId()));
        item.setTotalVotes((int) ratingRepository.countByItem_ItemId(item.getItemId()));
        itemRepository.save(item);
    }

    private RatingSummaryDTO summary(Integer itemId, Byte myScore) {
        return new RatingSummaryDTO(itemId, averageScore(itemId), ratingRepository.countByItem_ItemId(itemId), myScore);
    }

    private BigDecimal averageScore(Integer itemId) {
        Double average = ratingRepository.findAverageScoreByItemId(itemId);
        return average == null
                ? BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP);
    }

    private Item findItemOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private static UserRatingDTO toUserRatingDTO(Rating rating) {
        Item item = rating.getItem();
        return new UserRatingDTO(
                rating.getRatingId(),
                item.getItemId(),
                item.getName(),
                item.getImageUrl(),
                rating.getScore(),
                rating.getCreatedAt());
    }

    private static RatingDTO toDTO(Rating rating) {
        return new RatingDTO(
                rating.getRatingId(),
                rating.getItem().getItemId(),
                rating.getUser().getUserId(),
                rating.getUser().getUsername(),
                rating.getScore(),
                rating.getCreatedAt());
    }
}
