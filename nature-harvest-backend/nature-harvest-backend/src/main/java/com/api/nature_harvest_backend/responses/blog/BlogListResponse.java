package com.api.nature_harvest_backend.responses.blog;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogListResponse {
    private List<BlogResponse> blogs;
    private int totalPages;
}
