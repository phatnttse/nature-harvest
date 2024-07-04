package com.api.nature_harvest_backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comment_pictures")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentPicture {
    public static final int MAXIMUM_IMAGES_PER_COMMENT = 5;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    @JsonIgnore
    private Comment comment;

    @Column(name = "picture_url", length = 300)
    private String pictureUrl;
}
