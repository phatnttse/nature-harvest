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
}
