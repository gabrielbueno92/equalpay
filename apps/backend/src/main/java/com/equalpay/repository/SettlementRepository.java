package com.equalpay.repository;

import com.equalpay.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    
    @Query("SELECT s FROM Settlement s WHERE s.group.id = :groupId ORDER BY s.settledAt DESC")
    List<Settlement> findByGroupIdOrderBySettledAtDesc(@Param("groupId") Long groupId);
    
    @Query("SELECT s FROM Settlement s WHERE s.debtor.id = :userId OR s.creditor.id = :userId ORDER BY s.settledAt DESC")
    List<Settlement> findByUserIdOrderBySettledAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT s FROM Settlement s WHERE s.group.id = :groupId AND s.debtor.id = :debtorId AND s.creditor.id = :creditorId ORDER BY s.settledAt DESC")
    List<Settlement> findByGroupAndDebtorAndCreditorOrderBySettledAtDesc(
            @Param("groupId") Long groupId, 
            @Param("debtorId") Long debtorId, 
            @Param("creditorId") Long creditorId);
}