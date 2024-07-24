package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.blog.BlogDto;
import com.api.nature_harvest_backend.models.Blog;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.blog.BlogListResponse;
import com.api.nature_harvest_backend.responses.blog.BlogResponse;
import com.api.nature_harvest_backend.services.blog.IBlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/blogs")
@RequiredArgsConstructor
public class BlogController {
    private final IBlogService blogService;

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogResponse> createBlog(@Valid @RequestBody BlogDto blogDto) {
        try {
            return ResponseEntity.ok(BlogResponse.fromBlog(blogService.createBlog(blogDto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogDto blogDto) {
        try {
            return ResponseEntity.ok(BlogResponse.fromBlog(blogService.updateBlog(id, blogDto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse> deleteBlog(@PathVariable Long id) {
        try {
            if (!blogService.deleteBlog(id)) {
                return ResponseEntity.ok(BaseResponse.builder()
                        .message("Delete blog failed")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .build());
            }
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Delete blog successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }

    @GetMapping("")
    public ResponseEntity<BlogListResponse> getBlogs(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "8") int limit) {
        try {
            Page<Blog> blogPage = blogService.getBlogs(PageRequest.of(page, limit));
            return ResponseEntity.ok(BlogListResponse.builder()
                    .blogs(blogPage.getContent().stream().map(BlogResponse::fromBlog).toList())
                    .totalPages(blogPage.getTotalPages())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> getBlog(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(BlogResponse.fromBlog(blogService.getBlog(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/tags/{tag}")
    public ResponseEntity<BlogListResponse> getBlogByTags(@PathVariable String tag) {
        try {
            return ResponseEntity.ok(BlogListResponse.builder()
                    .blogs(blogService.getBlogByTags(tag).stream().map(BlogResponse::fromBlog).toList())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogResponse> getBlogBySlug(@PathVariable String slug) {
        try {
            return ResponseEntity.ok(BlogResponse.fromBlog(blogService.findBySlug(slug)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
