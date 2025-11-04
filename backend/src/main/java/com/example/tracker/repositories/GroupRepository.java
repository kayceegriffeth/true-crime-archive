package com.example.tracker.repositories;

import com.example.tracker.models.CaseGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface GroupRepository extends JpaRepository<CaseGroups, Long>, JpaSpecificationExecutor<CaseGroups> {
}
