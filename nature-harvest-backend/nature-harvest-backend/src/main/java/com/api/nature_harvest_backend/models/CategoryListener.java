package com.api.nature_harvest_backend.models;

import com.api.nature_harvest_backend.services.category.ICategoryRedisService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class CategoryListener {
    private final ICategoryRedisService categoryRedisService;
    private static final Logger logger = LoggerFactory.getLogger(ProductListener.class);

    @PrePersist
    public void prePersist(Category category) {
        logger.info("prePersist");
    }

    @PostPersist //save = persis
    public void postPersist(Category category) {
        // Update Redis cache
        logger.info("postPersist");
        categoryRedisService.clear();
    }

    @PreUpdate
    public void preUpdate(Category category) {
        //ApplicationEventPublisher.instance().publishEvent(event);
        logger.info("preUpdate");
    }

    @PostUpdate
    public void postUpdate(Category category) {
        // Update Redis cache
        logger.info("postUpdate");
        categoryRedisService.clear();
    }

    @PreRemove
    public void preRemove(Category category) {
        //ApplicationEventPublisher.instance().publishEvent(event);
        logger.info("preRemove");
    }

    @PostRemove
    public void postRemove(Category category) {
        // Update Redis cache
        logger.info("postRemove");
        categoryRedisService.clear();
    }
}
