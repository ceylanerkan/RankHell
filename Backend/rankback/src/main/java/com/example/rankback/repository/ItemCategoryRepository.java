package com.example.rankback.repository;

import com.example.rankback.entity.ItemCategory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Integer> {

    @EntityGraph(attributePaths = "category")
    List<ItemCategory> findByItem_ItemIdIn(List<Integer> itemIds);

    @EntityGraph(attributePaths = "category")
    List<ItemCategory> findByItem_ItemId(Integer itemId);

    List<ItemCategory> findByCategory_CategoryId(Integer categoryId);

    Optional<ItemCategory> findByItem_ItemIdAndCategory_CategoryId(Integer itemId, Integer categoryId);

    boolean existsByItem_ItemIdAndCategory_CategoryId(Integer itemId, Integer categoryId);
}
