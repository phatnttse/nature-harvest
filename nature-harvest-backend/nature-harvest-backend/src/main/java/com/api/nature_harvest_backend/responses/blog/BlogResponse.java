package com.api.nature_harvest_backend.responses.blog;

import com.api.nature_harvest_backend.models.Blog;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BlogResponse {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String thumbnail;
    private String slug;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String tags;
    private String summary;

    public static BlogResponse fromBlog(Blog blog) {
        return BlogResponse.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .author(blog.getAuthor().getName())
                .thumbnail(blog.getThumbnail())
                .slug(blog.getSlug())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .tags(blog.getTags())
                .summary(blog.getSummary())
                .build();
    }
}
