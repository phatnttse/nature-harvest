package com.api.nature_harvest_backend.responses.user;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdatePictureResponse {
    private String pictureUrl;
}
