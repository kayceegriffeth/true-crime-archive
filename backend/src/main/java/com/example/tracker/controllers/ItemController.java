package com.example.tracker.controllers;

import com.example.tracker.models.Item;
import com.example.tracker.repositories.ItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ItemController {

    private final ItemRepository items;

    @PersistenceContext
    private EntityManager em;

    public ItemController(ItemRepository items) {
        this.items = items;
    }

    @GetMapping
    public List<Item> getAllItems() {
        return items.findAll();
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        return items.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + id));
    }

    @GetMapping("/search")
    public List<Item> searchItems(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String order
    ) {
        String jpql = "SELECT i FROM Item i WHERE 1=1";

        if (keyword != null && !keyword.isEmpty()) {
            jpql += " AND (LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(i.victimName) LIKE LOWER(CONCAT('%', :keyword, '%')))";
        }

        if (location != null && !location.isEmpty()) {
            jpql += " AND (LOWER(i.locationCity) LIKE LOWER(CONCAT('%', :location, '%')) " +
                    "OR LOWER(i.locationState) LIKE LOWER(CONCAT('%', :location, '%')))";
        }

        jpql += " ORDER BY i." + sortBy + ("desc".equalsIgnoreCase(order) ? " DESC" : " ASC");

        var query = em.createQuery(jpql, Item.class);
        if (keyword != null && !keyword.isEmpty()) query.setParameter("keyword", keyword);
        if (location != null && !location.isEmpty()) query.setParameter("location", location);

        return query.getResultList();
    }
}
