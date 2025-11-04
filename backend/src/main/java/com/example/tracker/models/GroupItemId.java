package com.example.tracker.models;

import lombok.*;
import java.io.Serializable;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class GroupItemId implements Serializable {
    private Long groupId;
    private Long itemId;
}
