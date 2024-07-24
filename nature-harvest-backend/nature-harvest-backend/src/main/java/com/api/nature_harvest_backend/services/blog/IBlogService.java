package com.api.nature_harvest_backend.services.blog;

import com.api.nature_harvest_backend.dtos.blog.BlogDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IBlogService {
    Blog createBlog(BlogDto blogDto);

    Blog updateBlog(Long id, BlogDto blogDto) throws DataNotFoundException;

    boolean deleteBlog(Long id) throws DataNotFoundException;

    Page<Blog> getBlogs(Pageable pageable);

    Blog getBlog(Long id) throws DataNotFoundException;

    List<Blog> getBlogByTags(String tags);

    Blog findBySlug(String slug) throws DataNotFoundException;

}
