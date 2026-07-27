package com.example.rankback.repository;

import com.example.rankback.entity.ItemTag;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemTagRepository extends JpaRepository<ItemTag, Integer> {

    @EntityGraph(attributePaths = "tag")
    List<ItemTag> findByItem_ItemId(Integer itemId);

    @EntityGraph(attributePaths = "tag")
    List<ItemTag> findByItem_ItemIdIn(List<Integer> itemIds);

    @EntityGraph(attributePaths = "item")
    List<ItemTag> findByTag_TagId(Integer tagId);

    Optional<ItemTag> findByItem_ItemIdAndTag_TagId(Integer itemId, Integer tagId);

    boolean existsByItem_ItemIdAndTag_TagId(Integer itemId, Integer tagId);
}
