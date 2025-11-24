package com.example.tracker.dao;

import com.example.tracker.models.Visibility;

public record GroupDao(
        Long id,
        String name,
        String description,
        String imageUrl,
        Visibility visibility
) {}
