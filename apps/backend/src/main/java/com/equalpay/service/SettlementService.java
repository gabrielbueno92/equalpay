package com.equalpay.service;

import com.equalpay.dto.SettlementDTO;
import com.equalpay.dto.UserDTO;
import com.equalpay.entity.Group;
import com.equalpay.entity.Settlement;
import com.equalpay.entity.User;
import com.equalpay.repository.GroupRepository;
import com.equalpay.repository.SettlementRepository;
import com.equalpay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GroupRepository groupRepository;

    public List<SettlementDTO> getSettlementsByGroupId(Long groupId) {
        List<Settlement> settlements = settlementRepository.findByGroupIdOrderBySettledAtDesc(groupId);
        return settlements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<SettlementDTO> getSettlementsByUserId(Long userId) {
        List<Settlement> settlements = settlementRepository.findByUserIdOrderBySettledAtDesc(userId);
        return settlements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<SettlementDTO> getSettlementById(Long id) {
        return settlementRepository.findById(id)
                .map(this::convertToDTO);
    }

    public SettlementDTO recordSettlement(SettlementDTO settlementDTO) {
        // Validar que el deudor y acreedor existen
        User debtor = userRepository.findById(settlementDTO.getDebtorId())
                .orElseThrow(() -> new IllegalArgumentException("Deudor no encontrado"));
                
        User creditor = userRepository.findById(settlementDTO.getCreditorId())
                .orElseThrow(() -> new IllegalArgumentException("Acreedor no encontrado"));
                
        Group group = groupRepository.findById(settlementDTO.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Grupo no encontrado"));

        // Validar que ambos usuarios son miembros del grupo
        if (!group.getMembers().contains(debtor)) {
            throw new IllegalArgumentException("El deudor debe ser miembro del grupo");
        }
        if (!group.getMembers().contains(creditor)) {
            throw new IllegalArgumentException("El acreedor debe ser miembro del grupo");
        }

        // Crear la entidad Settlement
        Settlement settlement = new Settlement(group, debtor, creditor, settlementDTO.getAmount());
        settlement.setNotes(settlementDTO.getNotes());
        
        if (settlementDTO.getSettledAt() != null) {
            settlement.setSettledAt(settlementDTO.getSettledAt());
        }

        Settlement savedSettlement = settlementRepository.save(settlement);
        return convertToDTO(savedSettlement);
    }

    public void deleteSettlement(Long id) {
        if (!settlementRepository.existsById(id)) {
            throw new IllegalArgumentException("Liquidación no encontrada");
        }
        settlementRepository.deleteById(id);
    }

    public BigDecimal getTotalSettledByGroup(Long groupId) {
        List<Settlement> settlements = settlementRepository.findByGroupIdOrderBySettledAtDesc(groupId);
        return settlements.stream()
                .map(Settlement::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalPaidByUser(Long userId) {
        // Total que el usuario ha pagado a otros (como deudor)
        List<Settlement> settlements = settlementRepository.findByUserIdOrderBySettledAtDesc(userId);
        return settlements.stream()
                .filter(s -> s.getDebtor().getId().equals(userId))
                .map(Settlement::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalReceivedByUser(Long userId) {
        // Total que el usuario ha recibido de otros (como acreedor)
        List<Settlement> settlements = settlementRepository.findByUserIdOrderBySettledAtDesc(userId);
        return settlements.stream()
                .filter(s -> s.getCreditor().getId().equals(userId))
                .map(Settlement::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private SettlementDTO convertToDTO(Settlement settlement) {
        UserDTO debtorDTO = new UserDTO(
                settlement.getDebtor().getId(),
                settlement.getDebtor().getName(),
                settlement.getDebtor().getEmail(),
                settlement.getDebtor().getCreatedAt(),
                settlement.getDebtor().getUpdatedAt()
        );
        
        UserDTO creditorDTO = new UserDTO(
                settlement.getCreditor().getId(),
                settlement.getCreditor().getName(),
                settlement.getCreditor().getEmail(),
                settlement.getCreditor().getCreatedAt(),
                settlement.getCreditor().getUpdatedAt()
        );

        SettlementDTO dto = new SettlementDTO(
                settlement.getId(),
                settlement.getGroup().getId(),
                debtorDTO,
                creditorDTO,
                settlement.getAmount(),
                settlement.getSettledAt(),
                settlement.getNotes()
        );
        dto.setCreatedAt(settlement.getCreatedAt());
        return dto;
    }
}