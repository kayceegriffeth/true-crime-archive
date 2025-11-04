package com.example.tracker.repositories;

import com.example.tracker.models.GroupItems;
import com.example.tracker.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GroupItemRepository extends JpaRepository<GroupItems, Long> {

    @Query("SELECT gi FROM GroupItems gi WHERE gi.group.id = :groupId")
    List<GroupItems> findLinksByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT gi.item FROM GroupItems gi WHERE gi.group.id = :groupId")
    List<Item> findItemsByGroupId(@Param("groupId") Long groupId);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM GroupItems gi WHERE gi.group.id = :groupId")
    void deleteLinksByGroupId(@Param("groupId") Long groupId);
}
