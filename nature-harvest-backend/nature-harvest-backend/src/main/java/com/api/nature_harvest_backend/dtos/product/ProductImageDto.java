package com.api.nature_harvest_backend.dtos.product;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageDto {
    private List<String> urls;
}
