package com.example.rankback.service;

import com.example.rankback.dto.CategoryDTO;
import com.example.rankback.dto.ItemDTO;
import com.example.rankback.dto.ItemRequest;
import com.example.rankback.entity.Category;
import com.example.rankback.entity.Item;
import com.example.rankback.entity.ItemCategory;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.CategoryRepository;
import com.example.rankback.repository.ItemCategoryRepository;
import com.example.rankback.repository.ItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemCategoryRepository itemCategoryRepository;
    private final CategoryRepository categoryRepository;

    public ItemService(ItemRepository itemRepository,
                       ItemCategoryRepository itemCategoryRepository,
                       CategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.itemCategoryRepository = itemCategoryRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ItemDTO> getItems(Integer categoryId, Integer tagId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Item> itemPage;
        if (categoryId != null) {
            itemPage = itemRepository.findByCategoryId(categoryId, pageRequest);
        } else if (tagId != null) {
            itemPage = itemRepository.findByTagId(tagId, pageRequest);
        } else {
            itemPage = itemRepository.findAll(pageRequest);
        }
        return toDTOs(itemPage.getContent());
    }

    @Transactional(readOnly = true)
    public List<ItemDTO> getTopItems(int limit) {
        Page<Item> itemPage = itemRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "globalScore")));
        return toDTOs(itemPage.getContent());
    }

    @Transactional(readOnly = true)
    public ItemDTO getItem(Integer itemId) {
        return toDTOs(List.of(findOrThrow(itemId))).get(0);
    }

    @Transactional
    public ItemDTO createItem(ItemRequest request) {
        Item item = new Item();
        item.setName(request.name());
        item.setDescription(request.description());
        item.setImageUrl(request.imageUrl());

        Item saved = itemRepository.save(item);
        if (request.categoryIds() != null) {
            replaceCategories(saved, request.categoryIds());
        }
        return toDTOs(List.of(saved)).get(0);
    }

    @Transactional
    public ItemDTO updateItem(Integer itemId, ItemRequest request) {
        Item item = findOrThrow(itemId);
        item.setName(request.name());
        item.setDescription(request.description());
        item.setImageUrl(request.imageUrl());

        Item saved = itemRepository.save(item);
        if (request.categoryIds() != null) {
            replaceCategories(saved, request.categoryIds());
        }
        return toDTOs(List.of(saved)).get(0);
    }

    /**
     * Soft delete: the row stays, but @SQLRestriction hides it from every read path.
     */
    @Transactional
    public void deleteItem(Integer itemId) {
        Item item = findOrThrow(itemId);
        item.setIsDeleted(true);
        itemRepository.save(item);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getItemCategories(Integer itemId) {
        findOrThrow(itemId);
        return itemCategoryRepository.findByItem_ItemId(itemId).stream()
                .map(ic -> CategoryService.toDTO(ic.getCategory()))
                .toList();
    }

    @Transactional
    public List<CategoryDTO> addItemCategory(Integer itemId, Integer categoryId) {
        Item item = findOrThrow(itemId);
        if (!itemCategoryRepository.existsByItem_ItemIdAndCategory_CategoryId(itemId, categoryId)) {
            itemCategoryRepository.save(link(item, findCategoryOrThrow(categoryId)));
        }
        return getItemCategories(itemId);
    }

    @Transactional
    public List<CategoryDTO> removeItemCategory(Integer itemId, Integer categoryId) {
        findOrThrow(itemId);
        ItemCategory existing = itemCategoryRepository.findByItem_ItemIdAndCategory_CategoryId(itemId, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Item " + itemId + " is not linked to category " + categoryId));
        itemCategoryRepository.delete(existing);
        return getItemCategories(itemId);
    }

    Item findOrThrow(Integer itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
    }

    private Category findCategoryOrThrow(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }

    private void replaceCategories(Item item, List<Integer> categoryIds) {
        itemCategoryRepository.deleteAll(itemCategoryRepository.findByItem_ItemId(item.getItemId()));
        // Hibernate flushes inserts before deletes, which would trip the (item_id, category_id)
        // unique constraint when a category is kept, so the removals have to land first.
        itemCategoryRepository.flush();

        List<ItemCategory> links = categoryIds.stream()
                .distinct()
                .map(categoryId -> link(item, findCategoryOrThrow(categoryId)))
                .toList();
        itemCategoryRepository.saveAll(links);
    }

    private ItemCategory link(Item item, Category category) {
        ItemCategory itemCategory = new ItemCategory();
        itemCategory.setItem(item);
        itemCategory.setCategory(category);
        return itemCategory;
    }

    private List<ItemDTO> toDTOs(List<Item> items) {
        if (items.isEmpty()) {
            return List.of();
        }

        List<Integer> itemIds = items.stream().map(Item::getItemId).toList();
        Map<Integer, List<CategoryDTO>> categoriesByItemId = itemCategoryRepository.findByItem_ItemIdIn(itemIds).stream()
                .collect(Collectors.groupingBy(
                        ic -> ic.getItem().getItemId(),
                        Collectors.mapping(
                                ic -> CategoryService.toDTO(ic.getCategory()),
                                Collectors.toList())
                ));

        return items.stream()
                .map(item -> new ItemDTO(
                        item.getItemId(),
                        item.getName(),
                        item.getDescription(),
                        item.getImageUrl(),
                        item.getGlobalScore(),
                        item.getTotalVotes(),
                        categoriesByItemId.getOrDefault(item.getItemId(), List.of())
                ))
                .toList();
    }
}
