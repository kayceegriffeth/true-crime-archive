package com.example.tracker.services;

import com.example.tracker.dao.ItemDao;
import com.example.tracker.dao.Mappers;
import com.example.tracker.models.*;
import com.example.tracker.repositories.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ItemService {
    private final ItemRepository items;
    private final UserRepository users;
    private final AuthUtil auth;

    public ItemService(ItemRepository items, UserRepository users, AuthUtil auth) {
        this.items = items;
        this.users = users;
        this.auth = auth;
    }

    public ItemDao create(ItemDao dto) {
        var owner = users.findByUsername(auth.currentUsername()).orElseThrow();
        Item i = Item.builder()
                .owner(owner)
                .title(dto.title())
                .description(dto.description())
                .victimName(dto.victimName())
                .locationCity(dto.locationCity())
                .locationState(dto.locationState())
                .status(dto.status() == null ? CaseStatus.OPEN : dto.status())
                .visibility(dto.visibility() == null ? Visibility.PRIVATE : dto.visibility())
                .year(dto.year())
                .build();
        return Mappers.toDto(items.save(i));
    }

    public ItemDao get(Long id) {
        Item i = items.findById(id).orElseThrow();
        if (i.getVisibility() == Visibility.PUBLIC) return Mappers.toDto(i);
        var me = users.findByUsername(auth.currentUsername()).orElseThrow();
        if (auth.isAdmin() || i.getOwner().getId().equals(me.getId())) return Mappers.toDto(i);
        throw new RuntimeException("Forbidden");
    }

    public ItemDao update(Long id, ItemDao dto) {
        Item i = items.findById(id).orElseThrow();
        var me = users.findByUsername(auth.currentUsername()).orElseThrow();
        if (!auth.isAdmin() && !i.getOwner().getId().equals(me.getId())) throw new RuntimeException("Forbidden");

        if (dto.title()!=null) i.setTitle(dto.title());
        if (dto.description()!=null) i.setDescription(dto.description());
        if (dto.victimName()!=null) i.setVictimName(dto.victimName());
        if (dto.locationCity()!=null) i.setLocationCity(dto.locationCity());
        if (dto.locationState()!=null) i.setLocationState(dto.locationState());
        if (dto.status()!=null) i.setStatus(dto.status());
        if (dto.visibility()!=null) i.setVisibility(dto.visibility());
        if (dto.year()!=null) i.setYear(dto.year());

        return Mappers.toDto(items.save(i));
    }

    public void delete(Long id) {
        Item i = items.findById(id).orElseThrow();
        var me = users.findByUsername(auth.currentUsername()).orElseThrow();
        if (!auth.isAdmin() && !i.getOwner().getId().equals(me.getId())) throw new RuntimeException("Forbidden");
        items.delete(i);
    }

    public Page<ItemDao> search(String q, CaseStatus status, String state, Integer year, Long ownerId,
                                Visibility vis, Pageable pageable) {
        Specification<Item> spec = ItemSpecifications.likeQ(q)
                .and(ItemSpecifications.hasStatus(status))
                .and(ItemSpecifications.hasState(state))
                .and(ItemSpecifications.hasYear(year))
                .and(ItemSpecifications.hasOwner(ownerId))
                .and(ItemSpecifications.hasVisibility(vis));
        var page = items.findAll(spec, pageable);
        return page.map(Mappers::toDto);
    }
}
