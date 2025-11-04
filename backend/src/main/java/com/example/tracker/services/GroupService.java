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
        return groups.findById(id)
                .map(Mappers::toGroupDao)
                .orElseThrow();
    }

    public GroupDao update(Long id, GroupDao dto) {
        var g = groups.findById(id).orElseThrow();
        g.setName(dto.name());
        g.setDescription(dto.description());
        g.setVisibility(dto.visibility());
        g.setImageUrl(dto.imageUrl());
        return Mappers.toGroupDao(groups.save(g));
    }

    public void delete(Long id) {
        groups.deleteById(id);
    }

    public Page<GroupDao> search(String q, Long ownerId, Visibility visibility, Pageable pageable) {
        Specification<CaseGroups> spec = (root, query, cb) -> cb.conjunction();

        if (q != null && !q.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + q.toLowerCase() + "%"));
        }
        if (ownerId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("owner").get("id"), ownerId));
        }
        if (visibility != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("visibility"), visibility));
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
