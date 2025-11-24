package com.example.tracker.controllers;

import com.example.tracker.dao.GroupDao;
import com.example.tracker.models.Item;
import com.example.tracker.models.Visibility;
import com.example.tracker.services.GroupService;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/{id}")
    public GroupDao getGroup(@PathVariable Long id) {
        return groupService.get(id);
    }

    @GetMapping("/{id}/items")
    public List<Item> getGroupItems(@PathVariable Long id) {
        groupService.get(id);
        return groupService.getItemsByGroupId(id);
    }

    @GetMapping
    public List<GroupDao> getAllGroups(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) Visibility visibility
    ) {
        var page = PageRequest.of(0, 500);
        return groupService.search(q, ownerId, visibility, page).getContent();
    }

    @PostMapping
    public GroupDao create(@RequestBody GroupDao newGroup) {
        return groupService.create(newGroup);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        groupService.delete(id);
    }

    @PostMapping("/{groupId}/items/{itemId}")
    public void addItem(@PathVariable Long groupId, @PathVariable Long itemId) {
        groupService.get(groupId);
        groupService.addItemToGroup(groupId, itemId);
    }

    @GetMapping("/search")
    public List<GroupDao> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String order
    ) {
        var page = PageRequest.of(0, 500);
        return groupService.search(keyword, null, null, page).getContent();
    }
}
