package com.api.nature_harvest_backend.dtos.blog;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BlogDto {
    @NotNull(message = "Title is required")
    private String title;

    @NotNull(message = "Content is required")
    private String content;

    @NotNull(message = "Thumbnail is required")
    private String thumbnail;

    @NotNull(message = "Tags is required")
    private String tags;

    @NotNull(message = "Summary is required")
    private String summary;

}
