package com.example.tracker.services;

import com.example.tracker.dao.GroupDao;
import com.example.tracker.dao.Mappers;
import com.example.tracker.models.*;
import com.example.tracker.repositories.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GroupService {
    private final GroupRepository groups;
    private final GroupItemRepository groupItems;
    private final ItemRepository items;
    private final UserRepository users;
    private final AuthUtil auth;

    public GroupService(GroupRepository groups, GroupItemRepository groupItems,
                        ItemRepository items, UserRepository users, AuthUtil auth) {
        this.groups = groups;
        this.groupItems = groupItems;
        this.items = items;
        this.users = users;
        this.auth = auth;
    }

public GroupDao get(Long id) {
    var group = groups.findById(id).orElseThrow();

    // Current logged-in user
    String current = auth.currentUsername();
    var user = users.findByUsername(current).orElseThrow();
    boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

    // If ADMIN → always allowed
    if (isAdmin) {
        return Mappers.toGroupDao(group);
    }

    // If USER → allow ONLY:
    // 1. PUBLIC groups
    // 2. Groups they own
    if (group.getVisibility() == Visibility.PUBLIC || 
        group.getOwner().getId().equals(user.getId())) {

        return Mappers.toGroupDao(group);
    }

    // Otherwise block
    throw new RuntimeException("Access denied: This collection is private.");
}


    public GroupDao update(Long id, GroupDao dto) {
        var g = groups.findById(id).orElseThrow();

        // Update each field if provided
        if (dto.name() != null && !dto.name().isBlank()) g.setName(dto.name());
        if (dto.description() != null) g.setDescription(dto.description());
        if (dto.visibility() != null) g.setVisibility(dto.visibility());
        if (dto.imageUrl() != null) g.setImageUrl(dto.imageUrl());

        // Ensure immediate persistence for test consistency
        var saved = groups.saveAndFlush(g);

        return Mappers.toGroupDao(saved);
    }

    public void delete(Long id) {
        groups.deleteById(id);
    }

public Page<GroupDao> search(String q, Long ownerId, Visibility visibility, Pageable pageable) {

    // Start with a base spec
    Specification<CaseGroups> spec = (root, query, cb) -> cb.conjunction();

    // === Keyword filtering ===
    if (q != null && !q.isBlank()) {
        spec = spec.and((root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + q.toLowerCase() + "%"));
    }

    // === Owner filtering (if explicitly requested) ===
    if (ownerId != null) {
        spec = spec.and((root, query, cb) -> cb.equal(root.get("owner").get("id"), ownerId));
    }

    // === Explicit visibility filter (if passed from API) ===
    if (visibility != null) {
        spec = spec.and((root, query, cb) -> cb.equal(root.get("visibility"), visibility));
    }

    // === ROLE-BASED VISIBILITY FILTERING (main fix) ===
    String currentUser = auth.currentUsername();
    var user = users.findByUsername(currentUser).orElseThrow();
    boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

    if (!isAdmin) {
        // Users can only see:
        // 1. PUBLIC groups
        // 2. Their own PRIVATE groups
        spec = spec.and((root, query, cb) ->
                cb.or(
                        cb.equal(root.get("visibility"), Visibility.PUBLIC),
                        cb.equal(root.get("owner").get("id"), user.getId())
                )
        );
    }
    // Admin sees EVERYTHING, no restriction added.

    return groups.findAll(spec, pageable).map(Mappers::toGroupDao);
}

    public List<Item> getItemsByGroupId(Long groupId) {
        return groupItems.findItemsByGroupId(groupId);
    }

    public void addItemToGroup(Long groupId, Long itemId) {
        var group = groups.findById(groupId).orElseThrow();
        var item = items.findById(itemId).orElseThrow();

        GroupItems link = new GroupItems(group, item);
        groupItems.save(link);
    }

    public GroupDao create(GroupDao dto) {
        var username = auth.currentUsername();

        var owner = users.findByUsername(username).orElseGet(() -> {
            return users.findAll().stream().findFirst().orElseThrow();
        });

        CaseGroups g = CaseGroups.builder()
                .owner(owner)
                .name(dto.name())
                .description(dto.description())
                .visibility(dto.visibility() == null ? Visibility.PRIVATE : dto.visibility())
                .imageUrl(dto.imageUrl())
                .build();

        return Mappers.toGroupDao(groups.save(g));
    }
}
