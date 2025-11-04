package com.example.tracker.controllers;

import com.example.tracker.models.*;
import com.example.tracker.repositories.GroupItemRepository;
import com.example.tracker.repositories.GroupRepository;
import com.example.tracker.repositories.ItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class GroupController {

    private final GroupRepository groupRepo;
    private final ItemRepository itemRepo;
    private final GroupItemRepository groupItems;

    @PersistenceContext
    private EntityManager em;

    public GroupController(GroupRepository groupRepo, ItemRepository itemRepo, GroupItemRepository groupItems) {
        this.groupRepo = groupRepo;
        this.itemRepo = itemRepo;
        this.groupItems = groupItems;
    }

    @GetMapping
    public List<CaseGroups> getAllGroups() {
        return groupRepo.findAll();
    }

    @GetMapping("/{id}")
    public CaseGroups getGroup(@PathVariable Long id) {
        return groupRepo.findById(id).orElseThrow();
    }

    @GetMapping("/{id}/items")
    public List<Item> getGroupItems(@PathVariable Long id) {
        return groupItems.findItemsByGroupId(id);
    }

    @PostMapping("/{groupId}/items/{itemId}")
    public void addItemToGroup(@PathVariable Long groupId, @PathVariable Long itemId) {
        var group = groupRepo.findById(groupId).orElseThrow();
        var item = itemRepo.findById(itemId).orElseThrow();
        var link = new GroupItems(group, item);
        groupItems.save(link);
    }

 
    @PostMapping
    public CaseGroups createGroup(@RequestBody CaseGroups newGroup) {
        if (newGroup.getVisibility() == null) {
            newGroup.setVisibility(Visibility.PRIVATE);
        }
        User owner = new User();
        owner.setId(2L); // "kaycee"
        newGroup.setOwner(owner);
        return groupRepo.save(newGroup);
    }

    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        var group = groupRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found with id: " + id));
        groupItems.deleteLinksByGroupId(id);
        groupRepo.delete(group);
    }

    @GetMapping("/search")
    public List<CaseGroups> searchGroups(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order
    ) {
        String jpql = "SELECT g FROM CaseGroups g WHERE 1=1";

        if (keyword != null && !keyword.isEmpty()) {
            jpql += " AND (LOWER(g.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(g.description) LIKE LOWER(CONCAT('%', :keyword, '%')))";
        }

        jpql += " ORDER BY g." + sortBy + ("desc".equalsIgnoreCase(order) ? " DESC" : " ASC");

        var query = em.createQuery(jpql, CaseGroups.class);
        if (keyword != null && !keyword.isEmpty()) query.setParameter("keyword", keyword);

        return query.getResultList();
    }
}
