package com.api.nature_harvest_backend.responses.comment;

import com.api.nature_harvest_backend.models.Comment;
import com.api.nature_harvest_backend.models.CommentPicture;
import com.api.nature_harvest_backend.responses.user.UserResponse;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private long id;
    private String content;
    private UserResponse userResponse;
    private int starRating;
    private List<CommentPicture> pictures;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse fromComment(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .starRating(comment.getStarRating())
                .userResponse(UserResponse.fromUser(comment.getUser()))
                .pictures(comment.getCommentPictures())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
