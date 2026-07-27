package com.example.rankback.service;

import com.example.rankback.dto.TagDTO;
import com.example.rankback.dto.TagRequest;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.ItemTag;
import com.example.rankback.entity.Tag;
import com.example.rankback.exception.DuplicateResourceException;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.ItemRepository;
import com.example.rankback.repository.ItemTagRepository;
import com.example.rankback.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final ItemTagRepository itemTagRepository;
    private final ItemRepository itemRepository;

    public TagService(TagRepository tagRepository, ItemTagRepository itemTagRepository, ItemRepository itemRepository) {
        this.tagRepository = tagRepository;
        this.itemTagRepository = itemTagRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream().map(TagService::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public TagDTO getTag(Integer tagId) {
        return toDTO(findOrThrow(tagId));
    }

    @Transactional
    public TagDTO createTag(TagRequest request) {
        if (tagRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException("Tag already exists: " + request.name());
        }

        Tag tag = new Tag();
        tag.setName(request.name());
        return toDTO(tagRepository.save(tag));
    }

    @Transactional
    public TagDTO updateTag(Integer tagId, TagRequest request) {
        Tag tag = findOrThrow(tagId);
        if (tagRepository.existsByNameIgnoreCaseAndTagIdNot(request.name(), tagId)) {
            throw new DuplicateResourceException("Tag already exists: " + request.name());
        }

        tag.setName(request.name());
        return toDTO(tagRepository.save(tag));
    }

    @Transactional
    public void deleteTag(Integer tagId) {
        Tag tag = findOrThrow(tagId);
        // Item_Tags has no cascade, so the links must go first.
        itemTagRepository.deleteAll(itemTagRepository.findByTag_TagId(tagId));
        tagRepository.delete(tag);
    }

    @Transactional(readOnly = true)
    public List<TagDTO> getItemTags(Integer itemId) {
        findItemOrThrow(itemId);
        return itemTagRepository.findByItem_ItemId(itemId).stream()
                .map(it -> toDTO(it.getTag()))
                .toList();
    }

    @Transactional
    public List<TagDTO> addItemTag(Integer itemId, Integer tagId) {
        Item item = findItemOrThrow(itemId);
        if (!itemTagRepository.existsByItem_ItemIdAndTag_TagId(itemId, tagId)) {
            ItemTag itemTag = new ItemTag();
            itemTag.setItem(item);
            itemTag.setTag(findOrThrow(tagId));
            itemTagRepository.save(itemTag);
        }
        return getItemTags(itemId);
    }

    @Transactional
    public List<TagDTO> removeItemTag(Integer itemId, Integer tagId) {
        findItemOrThrow(itemId);
        ItemTag existing = itemTagRepository.findByItem_ItemIdAndTag_TagId(itemId, tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Item " + itemId + " is not tagged with " + tagId));
        itemTagRepository.delete(existing);
        return getItemTags(itemId);
    }

    private Tag findOrThrow(Integer tagId) {
        return tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found: " + tagId));
    }

    private Item findItemOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private static TagDTO toDTO(Tag tag) {
        return new TagDTO(tag.getTagId(), tag.getName());
    }
}
