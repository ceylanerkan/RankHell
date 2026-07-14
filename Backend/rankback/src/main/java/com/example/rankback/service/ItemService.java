package com.example.rankback.service;

import com.example.rankback.dto.CategoryDTO;
import com.example.rankback.dto.ItemDTO;
import com.example.rankback.entity.Item;
import com.example.rankback.exception.ResourceNotFoundException;
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

    public ItemService(ItemRepository itemRepository, ItemCategoryRepository itemCategoryRepository) {
        this.itemRepository = itemRepository;
        this.itemCategoryRepository = itemCategoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ItemDTO> getItems(Integer categoryId, int page, int size) {
        Page<Item> itemPage = categoryId == null
                ? itemRepository.findAll(PageRequest.of(page, size))
                : itemRepository.findByCategoryId(categoryId, PageRequest.of(page, size));
        return toDTOs(itemPage.getContent());
    }

    @Transactional(readOnly = true)
    public List<ItemDTO> getTopItems(int limit) {
        Page<Item> itemPage = itemRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "globalScore")));
        return toDTOs(itemPage.getContent());
    }

    @Transactional(readOnly = true)
    public ItemDTO getItem(Integer itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + itemId));
        return toDTOs(List.of(item)).get(0);
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
                                ic -> new CategoryDTO(ic.getCategory().getCategoryId(), ic.getCategory().getName()),
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
