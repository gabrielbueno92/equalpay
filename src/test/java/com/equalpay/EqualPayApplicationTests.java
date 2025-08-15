package com.equalpay;

import com.equalpay.entity.User;
import com.equalpay.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EqualPayApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void contextLoads() {
        // Simple test to verify Spring context loads correctly
        assertNotNull(userRepository);
    }

    @Test
    void canCreateUser() {
        User user = new User("Test User", "test@example.com");
        User saved = userRepository.save(user);
        
        assertNotNull(saved.getId());
        assertEquals("Test User", saved.getName());
        assertEquals("test@example.com", saved.getEmail());
    }

    @Test
    void canFindUserByEmail() {
        User user = new User("Test User", "test@example.com");
        userRepository.save(user);
        
        User found = userRepository.findByEmail("test@example.com").orElse(null);
        assertNotNull(found);
        assertEquals("Test User", found.getName());
    }
}