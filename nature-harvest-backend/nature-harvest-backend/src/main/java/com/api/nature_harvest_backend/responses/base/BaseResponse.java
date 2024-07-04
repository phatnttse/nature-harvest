package com.api.nature_harvest_backend.responses.base;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BaseResponse {
    private int status;
    private String message;
}
