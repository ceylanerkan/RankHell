package com.example.rankback.controller;

import com.example.rankback.dto.TagDTO;
import com.example.rankback.service.TagService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Item_Tags join table: the tag links of a single item. */
@RestController
@RequestMapping("/api/items/{itemId}/tags")
public class ItemTagController {

    private final TagService tagService;

    public ItemTagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public List<TagDTO> getItemTags(@PathVariable Integer itemId) {
        return tagService.getItemTags(itemId);
    }

    @PostMapping("/{tagId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TagDTO> addItemTag(@PathVariable Integer itemId, @PathVariable Integer tagId) {
        return tagService.addItemTag(itemId, tagId);
    }

    @DeleteMapping("/{tagId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TagDTO> removeItemTag(@PathVariable Integer itemId, @PathVariable Integer tagId) {
        return tagService.removeItemTag(itemId, tagId);
    }
}
