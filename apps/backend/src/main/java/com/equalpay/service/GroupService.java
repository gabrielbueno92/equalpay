package com.equalpay.service;

import com.equalpay.dto.GroupDTO;
import com.equalpay.dto.UserDTO;
import com.equalpay.entity.Group;
import com.equalpay.entity.User;
import com.equalpay.repository.GroupRepository;
import com.equalpay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<GroupDTO> getGroupById(Long id) {
        return groupRepository.findById(id)
                .map(this::convertToDTO);
    }

    public GroupDTO createGroup(GroupDTO groupDTO, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario creador no encontrado"));

        Group group = new Group();
        group.setName(groupDTO.getName());
        group.setDescription(groupDTO.getDescription());
        group.setCreator(creator);
        group.addMember(creator);

        Group savedGroup = groupRepository.save(group);
        return convertToDTO(savedGroup);
    }

    public GroupDTO updateGroup(Long id, GroupDTO groupDTO) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grupo no encontrado"));

        group.setName(groupDTO.getName());
        group.setDescription(groupDTO.getDescription());

        Group updatedGroup = groupRepository.save(group);
        return convertToDTO(updatedGroup);
    }

    public void deleteGroup(Long id) {
        if (!groupRepository.existsById(id)) {
            throw new IllegalArgumentException("Grupo no encontrado");
        }
        groupRepository.deleteById(id);
    }

    public List<GroupDTO> searchGroupsByName(String name) {
        return groupRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<GroupDTO> getGroupsByUserId(Long userId) {
        return groupRepository.findGroupsByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<GroupDTO> getGroupsByCreatorId(Long creatorId) {
        return groupRepository.findByCreatorId(creatorId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public GroupDTO addMemberToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Grupo no encontrado"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (group.getMembers().contains(user)) {
            throw new IllegalArgumentException("El usuario ya es miembro del grupo");
        }

        group.addMember(user);
        Group updatedGroup = groupRepository.save(group);
        return convertToDTO(updatedGroup);
    }

    public GroupDTO removeMemberFromGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Grupo no encontrado"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!group.getMembers().contains(user)) {
            throw new IllegalArgumentException("El usuario no es miembro del grupo");
        }

        if (group.getCreator().equals(user)) {
            throw new IllegalArgumentException("No se puede eliminar al creador del grupo");
        }

        group.removeMember(user);
        Group updatedGroup = groupRepository.save(group);
        return convertToDTO(updatedGroup);
    }

    private GroupDTO convertToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setCreatedAt(group.getCreatedAt());
        dto.setUpdatedAt(group.getUpdatedAt());
        
        if (group.getCreator() != null) {
            dto.setCreator(new UserDTO(
                    group.getCreator().getId(),
                    group.getCreator().getName(),
                    group.getCreator().getEmail(),
                    group.getCreator().getCreatedAt(),
                    group.getCreator().getUpdatedAt()
            ));
        }

        if (group.getMembers() != null) {
            List<UserDTO> members = group.getMembers().stream()
                    .map(user -> new UserDTO(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getCreatedAt(),
                            user.getUpdatedAt()
                    ))
                    .collect(Collectors.toList());
            dto.setMembers(members);
        }

        return dto;
    }
}