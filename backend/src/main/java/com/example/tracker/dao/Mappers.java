package com.example.tracker.dao;

import com.example.tracker.models.*;

public class Mappers {

    public static ItemDao toDto(Item i) {
        return new ItemDao(
            i.getId(),
            i.getTitle(),
            i.getDescription(),
            i.getVictimName(),
            i.getLocationCity(),
            i.getLocationState(),
            i.getStatus(),
            i.getVisibility(),
            i.getYear(),
            i.getOwner() != null ? i.getOwner().getId() : null
        );
    }

    public static GroupDao toGroupDao(CaseGroups g) {
        if (g == null) return null;
        return new GroupDao(
            g.getId(),
            g.getName(),
            g.getDescription(),
            g.getImageUrl(),
            g.getVisibility()
        );
    }
}
