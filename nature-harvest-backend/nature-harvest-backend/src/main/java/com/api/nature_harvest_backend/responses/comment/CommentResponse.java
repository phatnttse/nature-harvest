package com.api.nature_harvest_backend.responses.comment;

import com.api.nature_harvest_backend.models.Comment;
import com.api.nature_harvest_backend.responses.user.UserResponse;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {
    private long id;
    private String content;
    private UserResponse userResponse;
    private String picture;
    private int starRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse fromComment(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .picture(comment.getPicture())
                .starRating(comment.getStarRating())
                .userResponse(UserResponse.fromUser(comment.getUser()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
