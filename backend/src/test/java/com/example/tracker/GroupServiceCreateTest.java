package com.example.tracker;

import com.example.tracker.dao.GroupDao;
import com.example.tracker.models.CaseGroups;
import com.example.tracker.models.User;
import com.example.tracker.models.Visibility;
import com.example.tracker.repositories.GroupItemRepository;
import com.example.tracker.repositories.GroupRepository;
import com.example.tracker.repositories.ItemRepository;
import com.example.tracker.repositories.UserRepository;
import com.example.tracker.services.GroupService;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GroupServiceCreateTest {

    @Test
    void create_assignsOwnerAndSavesGroup() {

        // --------------------------
        // Arrange (mock dependencies)
        // --------------------------
        GroupRepository groups = mock(GroupRepository.class);
        GroupItemRepository groupItems = mock(GroupItemRepository.class);
        ItemRepository items = mock(ItemRepository.class);
        UserRepository users = mock(UserRepository.class);

        // Mock user kaycee (default owner used in new GroupService)
        User u = new User();
        u.setId(2L);
        u.setUsername("kaycee");

        when(users.findByUsername("kaycee"))
                .thenReturn(Optional.of(u));

        // Match your real GroupDao:
        GroupDao dto = new GroupDao(
                null,               // id
                "Cold Cases",       // name
                "desc",             // description
                null,               // imageUrl
                Visibility.PRIVATE  // visibility
        );

        // Mock saved entity
        CaseGroups saved = CaseGroups.builder()
                .id(11L)
                .name("Cold Cases")
                .description("desc")
                .visibility(Visibility.PRIVATE)
                .owner(u)
                .build();

        when(groups.save(any(CaseGroups.class))).thenReturn(saved);

        // --------------------------
        // Act
        // --------------------------
        GroupService service =
                new GroupService(groups, groupItems, items, users);

        GroupDao result = service.create(dto);

        // --------------------------
        // Assert
        // --------------------------
        assertNotNull(result);
        assertEquals("Cold Cases", result.name());
        assertEquals(11L, result.id());
        assertEquals(Visibility.PRIVATE, result.visibility());

        verify(groups, times(1)).save(any(CaseGroups.class));
    }
}
