package com.api.nature_harvest_backend.services.comment;

import com.api.nature_harvest_backend.dtos.product.CommentDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Comment;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.comment.CommentListResponse;
import org.springframework.data.domain.PageRequest;

public interface ICommentService {
    Comment insertComment(CommentDto comment, User user) throws Exception;

    void deleteComment(Long commentId);

    Comment updateComment(Long id, User user, CommentDto commentDTO) throws DataNotFoundException;

    CommentListResponse getFilteredComments(Long productId, Integer starRating, Boolean hasImage, PageRequest pageRequest);

    CommentListResponse getComments(Long productId, PageRequest pageRequest);
}
