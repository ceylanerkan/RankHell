package com.example.rankback.service;

import com.example.rankback.dto.CommentDTO;
import com.example.rankback.dto.CommentRequest;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.ItemComment;
import com.example.rankback.entity.Role;
import com.example.rankback.entity.User;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.ItemCommentRepository;
import com.example.rankback.repository.ItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final ItemCommentRepository commentRepository;
    private final ItemRepository itemRepository;

    public CommentService(ItemCommentRepository commentRepository, ItemRepository itemRepository) {
        this.commentRepository = commentRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getItemComments(Integer itemId, int page, int size) {
        findItemOrThrow(itemId);
        Page<ItemComment> roots = commentRepository.findByItem_ItemIdAndParentCommentIsNull(
                itemId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        if (roots.isEmpty()) {
            return List.of();
        }

        List<Integer> rootIds = roots.getContent().stream().map(ItemComment::getCommentId).toList();
        Map<Integer, List<CommentDTO>> repliesByParent = commentRepository
                .findByParentComment_CommentIdInOrderByCreatedAtAsc(rootIds).stream()
                .collect(Collectors.groupingBy(
                        reply -> reply.getParentComment().getCommentId(),
                        Collectors.mapping(reply -> toDTO(reply, List.of()), Collectors.toList())));

        return roots.getContent().stream()
                .map(root -> toDTO(root, repliesByParent.getOrDefault(root.getCommentId(), List.of())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getUserComments(Integer userId, int page, int size) {
        return commentRepository
                .findByUser_UserId(userId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(comment -> toDTO(comment, List.of()))
                .toList();
    }

    @Transactional(readOnly = true)
    public CommentDTO getComment(Integer commentId) {
        return toDTO(findOrThrow(commentId), List.of());
    }

    @Transactional
    public CommentDTO createComment(Integer itemId, CommentRequest request, User author) {
        Item item = findItemOrThrow(itemId);

        ItemComment comment = new ItemComment();
        comment.setItem(item);
        comment.setUser(author);
        comment.setContent(request.content());
        comment.setCreatedAt(LocalDateTime.now());

        if (request.parentCommentId() != null) {
            ItemComment parent = findOrThrow(request.parentCommentId());
            if (!parent.getItem().getItemId().equals(itemId)) {
                throw new ResourceNotFoundException(
                        "Comment " + request.parentCommentId() + " does not belong to item " + itemId);
            }
            // Replies stay one level deep: answering a reply attaches to its root.
            comment.setParentComment(parent.getParentComment() == null ? parent : parent.getParentComment());
        }

        return toDTO(commentRepository.save(comment), List.of());
    }

    @Transactional
    public CommentDTO updateComment(Integer commentId, String content, User currentUser) {
        ItemComment comment = findOrThrow(commentId);
        requireOwnerOrAdmin(comment, currentUser);

        comment.setContent(content);
        return toDTO(commentRepository.save(comment), List.of());
    }

    @Transactional
    public void deleteComment(Integer commentId, User currentUser) {
        ItemComment comment = findOrThrow(commentId);
        requireOwnerOrAdmin(comment, currentUser);

        comment.setIsDeleted(true);
        commentRepository.save(comment);
    }

    private void requireOwnerOrAdmin(ItemComment comment, User currentUser) {
        boolean isOwner = comment.getUser().getUserId().equals(currentUser.getUserId());
        if (!isOwner && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("You can only modify your own comments");
        }
    }

    private ItemComment findOrThrow(Integer commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));
    }

    private Item findItemOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private static CommentDTO toDTO(ItemComment comment, List<CommentDTO> replies) {
        return new CommentDTO(
                comment.getCommentId(),
                comment.getItem().getItemId(),
                comment.getUser().getUserId(),
                comment.getUser().getUsername(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getParentComment() == null ? null : comment.getParentComment().getCommentId(),
                replies);
    }
}
