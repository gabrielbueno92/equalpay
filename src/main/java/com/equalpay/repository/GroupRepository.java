package com.equalpay.repository;

import com.equalpay.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT g FROM Group g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Group> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT g FROM Group g JOIN g.members m WHERE m.id = :userId")
    List<Group> findGroupsByUserId(@Param("userId") Long userId);

    @Query("SELECT g FROM Group g WHERE g.creator.id = :creatorId")
    List<Group> findByCreatorId(@Param("creatorId") Long creatorId);
}