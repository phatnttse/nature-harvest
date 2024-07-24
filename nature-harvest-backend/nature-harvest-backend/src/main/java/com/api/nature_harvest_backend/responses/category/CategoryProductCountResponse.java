package com.api.nature_harvest_backend.responses.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class CategoryProductCountResponse {
    private Long id;
    private String name;
    private String thumbnail;
    private String slug;
    private Long count;
}
