package com.example.tracker.services;

import com.example.tracker.models.*;
import org.springframework.data.jpa.domain.Specification;

public class ItemSpecifications {
    public static Specification<Item> likeQ(String q) {
        if (q == null || q.isBlank()) return null;
        String like = "%" + q.toLowerCase() + "%";
        return (root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), like),
                cb.like(cb.lower(root.get("description")), like),
                cb.like(cb.lower(root.get("victimName")), like)
        );
    }
    public static Specification<Item> hasStatus(CaseStatus s) {
        if (s == null) return null;
        return (r, cq, cb) -> cb.equal(r.get("status"), s);
    }
    public static Specification<Item> hasState(String state) {
        if (state == null || state.isBlank()) return null;
        return (r, cq, cb) -> cb.equal(cb.lower(r.get("locationState")), state.toLowerCase());
    }
    public static Specification<Item> hasOwner(Long ownerId) {
        if (ownerId == null) return null;
        return (r, cq, cb) -> cb.equal(r.get("owner").get("id"), ownerId);
    }
    public static Specification<Item> hasVisibility(Visibility v) {
        if (v == null) return null;
        return (r, cq, cb) -> cb.equal(r.get("visibility"), v);
    }
    public static Specification<Item> hasYear(Integer y) {
        if (y == null) return null;
        return (r, cq, cb) -> cb.equal(r.get("year"), y);
    }
}
