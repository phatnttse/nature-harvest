package com.api.nature_harvest_backend.responses.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class CommentListResponse {
    private List<CommentResponse> comments;
    private int totalPages;
    private long totalReviews;
    private long fiveStarReviews;
    private long fourStarReviews;
    private long threeStarReviews;
    private long twoStarReviews;
    private long oneStarReviews;
    private long imageReviews;
}
