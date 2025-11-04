package com.example.tracker.dao;

import com.example.tracker.models.Visibility;

public record GroupDao(
    Long id,
    String name,
    String description,
    String imageUrl,
    Visibility visibility
) {

    public GroupDao(Long id2, String name2, String description2, Visibility visibility2, Long long1, String imageUrl2) {
        this(id2, name2, description2, imageUrl2, visibility2);
    }}
