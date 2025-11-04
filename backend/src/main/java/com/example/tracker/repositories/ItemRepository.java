package com.example.tracker.repositories;

import com.example.tracker.models.Item;
import com.example.tracker.models.Visibility;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // ✅ ADD THIS IMPORT
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {
    List<Item> findByVisibility(Visibility visibility, Sort sort);
    List<Item> findByOwnerUsername(String username, Sort sort);
}
