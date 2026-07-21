package com.example.rankback.service;

import com.example.rankback.dto.CategoryDTO;
import com.example.rankback.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getCategoryId(), c.getName(), c.getTagline()))
                .toList();
    }
}
