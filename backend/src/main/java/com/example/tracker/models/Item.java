package com.example.tracker.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "items")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String victimName;
    private String locationCity;
    private String locationState;

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    private Integer year;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
}
