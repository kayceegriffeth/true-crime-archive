package com.example.tracker;

import com.example.tracker.dao.GroupDao;
import com.example.tracker.models.CaseGroups;
import com.example.tracker.models.Role;
import com.example.tracker.models.User;
import com.example.tracker.models.Visibility;
import com.example.tracker.repositories.GroupItemRepository;
import com.example.tracker.repositories.GroupRepository;
import com.example.tracker.repositories.ItemRepository;
import com.example.tracker.repositories.UserRepository;
import com.example.tracker.services.AuthUtil;
import com.example.tracker.services.GroupService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock private GroupRepository groupRepository;
    @Mock private GroupItemRepository groupItemRepository;
    @Mock private ItemRepository itemRepository;
    @Mock private UserRepository userRepository;
    @Mock private AuthUtil authUtil;

    @InjectMocks
    private GroupService groupService;

    @Test
    void contextLoads() {
        assertThat(groupService).isNotNull();
    }

    @Test
    void createGroup_UsesAuthUser_AndSavesCorrectly() {

        // ------------------------
        // Mock user + auth
        // ------------------------
        when(authUtil.currentUsername()).thenReturn("kaycee");

        User user = new User();
        user.setId(2L);
        user.setUsername("kaycee");
        user.setRole(Role.ROLE_ADMIN);

        when(userRepository.findByUsername("kaycee"))
                .thenReturn(Optional.of(user));

        // ------------------------
        // Input DTO
        // ------------------------
        GroupDao input = new GroupDao(
                null,
                "Test Group",
                "Mock description",
                null,
                Visibility.PUBLIC
        );

        // ------------------------
        // Mock saved entity from repository
        // ------------------------
        CaseGroups saved = CaseGroups.builder()
                .id(100L)
                .name("Test Group")
                .description("Mock description")
                .visibility(Visibility.PUBLIC)
                .owner(user)
                .build();

        when(groupRepository.save(any(CaseGroups.class))).thenReturn(saved);

        // ------------------------
        // Act
        // ------------------------
        GroupDao result = groupService.create(input);

        // ------------------------
        // Assert
        // ------------------------
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(100L);
        assertThat(result.name()).isEqualTo("Test Group");
        assertThat(result.visibility()).isEqualTo(Visibility.PUBLIC);

        verify(groupRepository, times(1)).save(any(CaseGroups.class));
        verify(authUtil, times(1)).currentUsername();
        verify(userRepository, times(1)).findByUsername("kaycee");
    }
}
