package com.api.nature_harvest_backend.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateUserPictureDto {
    @NotNull(message = "Picture url is required")
    private String pictureUrl;
}
