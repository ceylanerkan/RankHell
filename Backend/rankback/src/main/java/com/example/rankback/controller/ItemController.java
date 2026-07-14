package com.example.rankback.controller;

import com.example.rankback.dto.ItemDTO;
import com.example.rankback.service.ItemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<ItemDTO> getItems(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return itemService.getItems(categoryId, page, size);
    }

    @GetMapping("/top")
    public List<ItemDTO> getTopItems(@RequestParam(defaultValue = "5") int limit) {
        return itemService.getTopItems(limit);
    }

    @GetMapping("/{itemId}")
    public ItemDTO getItem(@PathVariable Integer itemId) {
        return itemService.getItem(itemId);
    }
}
