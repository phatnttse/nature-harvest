package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.CommentDto;
import com.api.nature_harvest_backend.models.Comment;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.comment.CommentListResponse;
import com.api.nature_harvest_backend.responses.comment.CommentResponse;
import com.api.nature_harvest_backend.responses.order.OrderAndOrderDetailsResponse;
import com.api.nature_harvest_backend.services.comment.ICommentService;
import com.api.nature_harvest_backend.services.order.IOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final ICommentService commentService;
    private final IOrderService orderService;

    @GetMapping("")
    public ResponseEntity<CommentListResponse> getAllComments(
            @RequestParam("productId") Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int limit
    ) {
        int totalPages = 0;
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("id").ascending()
        );
        CommentListResponse commentListResponse = commentService.getComments(productId, pageRequest);
        return ResponseEntity.ok(commentListResponse);
    }

    @GetMapping("/filter")
    public ResponseEntity<CommentListResponse> getFilteredComments(
            @RequestParam("productId") Long productId,
            @RequestParam(required = false) Integer starRating,
            @RequestParam(defaultValue = "false") boolean hasImage,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("id").ascending()
        );
        CommentListResponse commentListResponse = commentService.getFilteredComments(productId, starRating, hasImage, pageRequest);
        return ResponseEntity.ok(commentListResponse);
    }


    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable("id") Long commentId,
            @Valid @RequestBody CommentDto commentDto
    ) {
        try {
            User loginUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Comment comment = commentService.updateComment(commentId, loginUser, commentDto);
            return ResponseEntity.ok(CommentResponse.fromComment(comment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<?> insertComment(
            @Valid @RequestBody CommentDto commentDto
    ) {
        try {
            // Insert the new comment
            User loginUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            commentService.insertComment(commentDto, loginUser);
            List<OrderAndOrderDetailsResponse> orderAndOrderDetailsResponses = orderService.getOrdersByUserId(loginUser.getId());
            return ResponseEntity.ok(orderAndOrderDetailsResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}
