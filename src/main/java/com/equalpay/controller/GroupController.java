package com.equalpay.controller;

import com.equalpay.dto.GroupDTO;
import com.equalpay.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        List<GroupDTO> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Long id) {
        Optional<GroupDTO> group = groupService.getGroupById(id);
        return group.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<GroupDTO>> searchGroupsByName(@RequestParam String name) {
        List<GroupDTO> groups = groupService.searchGroupsByName(name);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupDTO>> getGroupsByUserId(@PathVariable Long userId) {
        List<GroupDTO> groups = groupService.getGroupsByUserId(userId);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<GroupDTO>> getGroupsByCreatorId(@PathVariable Long creatorId) {
        List<GroupDTO> groups = groupService.getGroupsByCreatorId(creatorId);
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@Valid @RequestBody GroupDTO groupDTO,
                                              @RequestParam Long creatorId) {
        try {
            GroupDTO createdGroup = groupService.createGroup(groupDTO, creatorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupDTO> updateGroup(@PathVariable Long id,
                                              @Valid @RequestBody GroupDTO groupDTO) {
        try {
            GroupDTO updatedGroup = groupService.updateGroup(id, groupDTO);
            return ResponseEntity.ok(updatedGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        try {
            groupService.deleteGroup(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupDTO> addMemberToGroup(@PathVariable Long groupId,
                                                   @PathVariable Long userId) {
        try {
            GroupDTO updatedGroup = groupService.addMemberToGroup(groupId, userId);
            return ResponseEntity.ok(updatedGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupDTO> removeMemberFromGroup(@PathVariable Long groupId,
                                                        @PathVariable Long userId) {
        try {
            GroupDTO updatedGroup = groupService.removeMemberFromGroup(groupId, userId);
            return ResponseEntity.ok(updatedGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}