package com.example.rankback.service;

import com.example.rankback.dto.VoteDTO;
import com.example.rankback.dto.VoteSummaryDTO;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.ItemVote;
import com.example.rankback.entity.User;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.ItemRepository;
import com.example.rankback.repository.ItemVoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VoteService {

    private static final byte UPVOTE = 1;
    private static final byte DOWNVOTE = -1;

    private final ItemVoteRepository voteRepository;
    private final ItemRepository itemRepository;

    public VoteService(ItemVoteRepository voteRepository, ItemRepository itemRepository) {
        this.voteRepository = voteRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public VoteSummaryDTO getSummary(Integer itemId, Integer currentUserId) {
        findItemOrThrow(itemId);
        Byte myVote = currentUserId == null
                ? null
                : voteRepository.findByUser_UserIdAndItem_ItemId(currentUserId, itemId)
                        .map(ItemVote::getVoteValue)
                        .orElse(null);
        return summary(itemId, myVote);
    }

    @Transactional(readOnly = true)
    public VoteDTO getMyVote(Integer itemId, Integer currentUserId) {
        findItemOrThrow(itemId);
        return voteRepository.findByUser_UserIdAndItem_ItemId(currentUserId, itemId)
                .map(VoteService::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("No vote for item: " + itemId));
    }

    /**
     * Upsert: a second call with the same value simply keeps it, a different value flips it.
     */
    @Transactional
    public VoteSummaryDTO castVote(Integer itemId, Byte value, User user) {
        if (value != UPVOTE && value != DOWNVOTE) {
            throw new IllegalArgumentException("Vote value must be 1 (up) or -1 (down)");
        }

        Item item = findItemOrThrow(itemId);
        Optional<ItemVote> existing = voteRepository.findByUser_UserIdAndItem_ItemId(user.getUserId(), itemId);

        ItemVote vote = existing.orElseGet(() -> {
            ItemVote created = new ItemVote();
            created.setItem(item);
            created.setUser(user);
            created.setCreatedAt(LocalDateTime.now());
            return created;
        });
        vote.setVoteValue(value);
        voteRepository.save(vote);

        refreshCounters(item);
        return summary(itemId, value);
    }

    @Transactional
    public VoteSummaryDTO removeVote(Integer itemId, User user) {
        Item item = findItemOrThrow(itemId);
        ItemVote vote = voteRepository.findByUser_UserIdAndItem_ItemId(user.getUserId(), itemId)
                .orElseThrow(() -> new ResourceNotFoundException("No vote for item: " + itemId));
        voteRepository.delete(vote);

        refreshCounters(item);
        return summary(itemId, null);
    }

    /** Keeps the denormalized counters on Items in sync with the Item_Votes rows. */
    private void refreshCounters(Item item) {
        long upvotes = voteRepository.countByItem_ItemIdAndVoteValue(item.getItemId(), UPVOTE);
        long downvotes = voteRepository.countByItem_ItemIdAndVoteValue(item.getItemId(), DOWNVOTE);
        item.setUpvoteCount((int) upvotes);
        item.setDownvoteCount((int) downvotes);
        itemRepository.save(item);
    }

    private VoteSummaryDTO summary(Integer itemId, Byte myVote) {
        long upvotes = voteRepository.countByItem_ItemIdAndVoteValue(itemId, UPVOTE);
        long downvotes = voteRepository.countByItem_ItemIdAndVoteValue(itemId, DOWNVOTE);
        return new VoteSummaryDTO(itemId, upvotes, downvotes, upvotes - downvotes, myVote);
    }

    private Item findItemOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private static VoteDTO toDTO(ItemVote vote) {
        return new VoteDTO(
                vote.getVoteId(),
                vote.getItem().getItemId(),
                vote.getUser().getUserId(),
                vote.getVoteValue(),
                vote.getCreatedAt());
    }
}
