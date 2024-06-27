package com.api.nature_harvest_backend.services.comment;

import com.api.nature_harvest_backend.dtos.CommentDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Comment;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.comment.CommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ICommentService {
    Comment insertComment(CommentDto comment, User user) throws Exception;

    void deleteComment(Long commentId);

    Comment updateComment(Long id, User user, CommentDto commentDTO) throws DataNotFoundException;

    Page<CommentResponse> getCommentsByUserAndProduct(String userId, Long productId, PageRequest pageRequest);

    List<CommentResponse> getCommentsByProduct(Long productId);
}
