package com.example.tracker.services;

import com.example.tracker.models.CaseGroups;
import org.springframework.data.jpa.domain.Specification;

public class GroupSpecifications {

    public static Specification<CaseGroups> hasName(String name) {
        return (root, query, builder) -> builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<CaseGroups> hasVisibility(String visibility) {
        return (root, query, builder) -> builder.equal(root.get("visibility"), visibility);
    }

    public static Specification<CaseGroups> hasOwnerId(Long ownerId) {
        return (root, query, builder) -> builder.equal(root.get("owner").get("id"), ownerId);
    }
}
