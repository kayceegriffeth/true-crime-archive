package com.example.tracker.dao;

import com.example.tracker.models.CaseStatus;
import com.example.tracker.models.Visibility;

public record ItemDao(
        Long id,
        String title,
        String description,
        String victimName,
        String locationCity,
        String locationState,
        CaseStatus status,
        Visibility visibility,
        Integer year,
        Long ownerId
) {}
