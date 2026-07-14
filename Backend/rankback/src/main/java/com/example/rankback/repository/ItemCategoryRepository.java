package com.example.rankback.repository;

import com.example.rankback.entity.ItemCategory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Integer> {

    @EntityGraph(attributePaths = "category")
    List<ItemCategory> findByItem_ItemIdIn(List<Integer> itemIds);
}
