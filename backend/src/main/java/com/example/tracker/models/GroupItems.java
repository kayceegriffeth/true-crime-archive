package com.example.tracker.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "group_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private CaseGroups group;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    public GroupItems(CaseGroups group, Item item) {
        this.group = group;
        this.item = item;
    }
}
