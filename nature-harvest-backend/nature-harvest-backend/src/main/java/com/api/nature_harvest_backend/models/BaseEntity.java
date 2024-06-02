package com.api.nature_harvest_backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.*;

import java.time.LocalDateTime;

@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass

public class BaseEntity{
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
