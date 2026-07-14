package com.example.rankback.repository;

import com.example.rankback.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {

    /**
     * Enforce pagination at the database level by disabling the unpaginated findAll method.
     */
    @Override
    default List<Item> findAll() {
        throw new UnsupportedOperationException("findAll() without pagination is strictly forbidden. Use findAll(Pageable) instead.");
    }

    @Query("SELECT i FROM Item i JOIN i.itemCategories ic WHERE ic.category.categoryId = :categoryId")
    Page<Item> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);
}
