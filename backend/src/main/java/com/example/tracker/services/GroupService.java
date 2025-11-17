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

    // AuthUtil is no longer used – we’re ignoring roles server-side
    public GroupService(GroupRepository groups,
                        GroupItemRepository groupItems,
                        ItemRepository items,
                        UserRepository users) {
        this.groups = groups;
        this.groupItems = groupItems;
        this.items = items;
        this.users = users;
    }

    public GroupDao get(Long id) {
        var group = groups.findById(id).orElseThrow();
        return Mappers.toGroupDao(group);
    }

    public GroupDao update(Long id, GroupDao dto) {
        var g = groups.findById(id).orElseThrow();

        if (dto.name() != null && !dto.name().isBlank()) g.setName(dto.name());
        if (dto.description() != null) g.setDescription(dto.description());
        if (dto.visibility() != null) g.setVisibility(dto.visibility());
        if (dto.imageUrl() != null) g.setImageUrl(dto.imageUrl());

        var saved = groups.saveAndFlush(g);
        return Mappers.toGroupDao(saved);
    }

 public void delete(Long id) {
    // First remove any item links manually since deleteByGroupId() doesn't exist
    var links = groupItems.findAll()
            .stream()
            .filter(gi -> gi.getGroup().getId().equals(id))
            .toList();

    groupItems.deleteAll(links);

    // Now delete the group itself
    groups.deleteById(id);
}


    public Page<GroupDao> search(String q, Long ownerId, Visibility visibility, Pageable pageable) {

        Specification<CaseGroups> spec = (root, query, cb) -> cb.conjunction();

        if (q != null && !q.isBlank()) {
            String like = "%" + q.toLowerCase() + "%";
            spec = spec.and((root, query, cb) ->
                cb.like(cb.lower(root.get("name")), like));
        }

        if (ownerId != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("owner").get("id"), ownerId));
        }

        if (visibility != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("visibility"), visibility));
        }

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
        // Pick a default owner: Kaycee if exists, otherwise first user in table
        var owner = users.findByUsername("kaycee")
                .orElseGet(() -> users.findAll().stream().findFirst().orElseThrow());

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
