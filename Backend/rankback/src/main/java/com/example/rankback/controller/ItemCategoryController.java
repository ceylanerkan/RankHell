package com.example.rankback.controller;

import com.example.rankback.dto.CategoryDTO;
import com.example.rankback.service.ItemService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Item_Categories join table: the category links of a single item. */
@RestController
@RequestMapping("/api/items/{itemId}/categories")
public class ItemCategoryController {

    private final ItemService itemService;

    public ItemCategoryController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<CategoryDTO> getItemCategories(@PathVariable Integer itemId) {
        return itemService.getItemCategories(itemId);
    }

    @PostMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CategoryDTO> addItemCategory(@PathVariable Integer itemId, @PathVariable Integer categoryId) {
        return itemService.addItemCategory(itemId, categoryId);
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CategoryDTO> removeItemCategory(@PathVariable Integer itemId, @PathVariable Integer categoryId) {
        return itemService.removeItemCategory(itemId, categoryId);
    }
}
