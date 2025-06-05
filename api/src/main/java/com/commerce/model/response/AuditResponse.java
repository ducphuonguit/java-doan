package com.commerce.model.response;

import com.commerce.model.entity.BaseAuditEntity;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Builder
@Data
public class AuditResponse {
    private Instant createdAt;
    private Instant updatedAt;
    private Integer createdBy;
    private Integer updatedBy;

    public static AuditResponse from(BaseAuditEntity entity) {
        return AuditResponse.builder()
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

}
