package com.example.tracker;

import com.example.tracker.dao.ItemDao;
import com.example.tracker.models.*;
import com.example.tracker.repositories.ItemRepository;
import com.example.tracker.repositories.UserRepository;
import com.example.tracker.services.AuthUtil;
import com.example.tracker.services.ItemService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Test
    void createAndGetItem_shouldSaveAndReturnExpectedItem() {
        // Arrange
        ItemRepository repo = mock(ItemRepository.class);
        UserRepository users = mock(UserRepository.class);
        AuthUtil auth = mock(AuthUtil.class);

        User fakeUser = new User();
        fakeUser.setId(1L);
        fakeUser.setUsername("kaycee");

        when(auth.currentUsername()).thenReturn("kaycee");
        when(users.findByUsername("kaycee")).thenReturn(Optional.of(fakeUser));

        Item savedEntity = Item.builder()
                .id(1L)
                .title("Zodiac")
                .description("Unsolved serial case")
                .owner(fakeUser)
                .visibility(Visibility.PUBLIC)
                .status(CaseStatus.OPEN)
                .year(1969)
                .build();

        when(repo.save(any(Item.class))).thenReturn(savedEntity);

        ItemService service = new ItemService(repo, users, auth);
        ItemDao input = new ItemDao(
                null, "Zodiac", "Unsolved serial case", "Unknown", "San Francisco", "CA",
                CaseStatus.OPEN, Visibility.PUBLIC, 1969, null
        );

        // Act
        ItemDao created = service.create(input);

        // Assert
        assertEquals("Zodiac", created.title());
        verify(repo, times(1)).save(any(Item.class));
    }

    @Test
    void create_withMissingUser_shouldThrowException() {
        // Arrange
        ItemRepository repo = mock(ItemRepository.class);
        UserRepository users = mock(UserRepository.class);
        AuthUtil auth = mock(AuthUtil.class);

        when(auth.currentUsername()).thenReturn("ghost");
        when(users.findByUsername("ghost")).thenReturn(Optional.empty());

        ItemService service = new ItemService(repo, users, auth);

        ItemDao input = new ItemDao(
                null, "Phantom", "Missing user test", "Unknown", "Nowhere", "NA",
                CaseStatus.CLOSED, Visibility.PRIVATE, 2000, null
        );

        // Act + Assert
        assertThrows(RuntimeException.class, () -> service.create(input));
    }

    @Test
    void search_shouldNotReturnNullOrThrow() {
        // Arrange
        ItemRepository repo = mock(ItemRepository.class);
        UserRepository users = mock(UserRepository.class);
        AuthUtil auth = mock(AuthUtil.class);

        ItemService itemService = new ItemService(repo, users, auth);

        Page<Item> fakePage = Page.empty(Pageable.unpaged());
        when(repo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(fakePage);

        // Act
        var result = itemService.search("anything", null, "title", null, null, null, Pageable.unpaged());

        // Assert
        assertNotNull(result, "Search should never return null");
        assertTrue(result.isEmpty(), "Search should return an empty page");
    }
}
