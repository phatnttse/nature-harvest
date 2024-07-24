package com.api.nature_harvest_backend.services.blog;

import com.api.nature_harvest_backend.dtos.blog.BlogDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Blog;
import com.api.nature_harvest_backend.models.Role;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.repositories.BlogRepository;
import com.api.nature_harvest_backend.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService implements IBlogService {
    private final BlogRepository blogRepository;

    @Override
    @Transactional
    public Blog createBlog(BlogDto blogDto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (loggedInUser == null) throw new RuntimeException("Unauthorized access");
        if (loggedInUser.getRole().getName().equalsIgnoreCase(Role.USER))
            throw new RuntimeException("Unauthorized access");
        Blog blog = Blog.builder()
                .title(blogDto.getTitle())
                .content(blogDto.getContent())
                .thumbnail(blogDto.getThumbnail())
                .slug(StringUtils.toSlug(blogDto.getTitle()))
                .tags(blogDto.getTags())
                .summary(blogDto.getSummary())
                .author(loggedInUser)
                .active(true)
                .build();
        return blogRepository.save(blog);
    }

    @Override
    @Transactional
    public Blog updateBlog(Long id, BlogDto blogDto) throws DataNotFoundException {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (loggedInUser == null) throw new RuntimeException("Unauthorized access");
        if (loggedInUser.getRole().getName().equals(Role.USER))
            throw new RuntimeException("Unauthorized access");

        Blog blog = blogRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Blog not found"));
        if (blogDto.getTitle() != null) blog.setTitle(blogDto.getTitle());
        if (blogDto.getContent() != null) blog.setContent(blogDto.getContent());
        if (blogDto.getTags() != null) blog.setTags(blogDto.getTags());
        if (blogDto.getSummary() != null) blog.setSummary(blogDto.getSummary());

        return blogRepository.save(blog);
    }

    @Override
    @Transactional
    public boolean deleteBlog(Long id) throws DataNotFoundException {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Blog not found"));
        if (!blog.isActive()) throw new DataNotFoundException("Blog is already deleted");
        blog.setActive(false);
        blogRepository.save(blog);
        return true;
    }

    @Override
    public Page<Blog> getBlogs(Pageable pageable) {
        return blogRepository.findByActiveTrue(pageable);
    }

    @Override
    public Blog getBlog(Long id) throws DataNotFoundException {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Blog not found"));
        if (!blog.isActive()) throw new DataNotFoundException("Blog is deleted");
        return blog;
    }

    @Override
    public List<Blog> getBlogByTags(String tags) {
        return blogRepository.findByTags(tags);
    }

    @Override
    public Blog findBySlug(String slug) throws DataNotFoundException {
        return blogRepository.findBySlug(slug).orElseThrow(() -> new DataNotFoundException("Blog not found"));
    }
}
