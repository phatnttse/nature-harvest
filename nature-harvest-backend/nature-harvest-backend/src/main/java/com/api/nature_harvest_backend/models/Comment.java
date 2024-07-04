package com.api.nature_harvest_backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "comments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @JoinColumn(name = "star_rating")
    private int starRating;

    private String content;

    @JoinColumn(name = "has_picture")
    private boolean hasPicture;

    @OneToMany(mappedBy = "comment",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<CommentPicture> commentPictures;
}
