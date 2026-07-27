package com.example.rankback.service;

import com.example.rankback.dto.CategoryDTO;
import com.example.rankback.dto.CategoryRequest;
import com.example.rankback.entity.Category;
import com.example.rankback.exception.DuplicateResourceException;
import com.example.rankback.exception.ResourceNotFoundException;
import com.example.rankback.repository.CategoryRepository;
import com.example.rankback.repository.ItemCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ItemCategoryRepository itemCategoryRepository;

    public CategoryService(CategoryRepository categoryRepository, ItemCategoryRepository itemCategoryRepository) {
        this.categoryRepository = categoryRepository;
        this.itemCategoryRepository = itemCategoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryService::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategory(Integer categoryId) {
        return toDTO(findOrThrow(categoryId));
    }

    @Transactional
    public CategoryDTO createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateResourceException("Category already exists: " + request.name());
        }

        Category category = new Category();
        category.setName(request.name());
        category.setTagline(request.tagline());
        category.setImageUrl(request.imageUrl());
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDTO updateCategory(Integer categoryId, CategoryRequest request) {
        Category category = findOrThrow(categoryId);
        if (categoryRepository.existsByNameIgnoreCaseAndCategoryIdNot(request.name(), categoryId)) {
            throw new DuplicateResourceException("Category already exists: " + request.name());
        }

        category.setName(request.name());
        category.setTagline(request.tagline());
        category.setImageUrl(request.imageUrl());
        return toDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Integer categoryId) {
        Category category = findOrThrow(categoryId);
        // Item_Categories has no cascade, so the links must go first.
        itemCategoryRepository.deleteAll(itemCategoryRepository.findByCategory_CategoryId(categoryId));
        categoryRepository.delete(category);
    }

    private Category findOrThrow(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }

    static CategoryDTO toDTO(Category category) {
        return new CategoryDTO(category.getCategoryId(), category.getName(), category.getTagline(), category.getImageUrl());
    }
}
