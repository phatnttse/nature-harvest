package com.api.nature_harvest_backend.models;

import com.api.nature_harvest_backend.services.subcategory.ISubCategoryRedisService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class SubCategoryListener {
    private final ISubCategoryRedisService subCategoryRedisService;
    private static final Logger logger = LoggerFactory.getLogger(ProductListener.class);

    @PrePersist
    public void prePersist(SubCategory category) {
        logger.info("prePersist");
    }

    @PostPersist //save = persis
    public void postPersist(SubCategory category) {
        // Update Redis cache
        logger.info("postPersist");
        subCategoryRedisService.clear();
    }

    @PreUpdate
    public void preUpdate(SubCategory category) {
        //ApplicationEventPublisher.instance().publishEvent(event);
        logger.info("preUpdate");
    }

    @PostUpdate
    public void postUpdate(SubCategory category) {
        // Update Redis cache
        logger.info("postUpdate");
        subCategoryRedisService.clear();
    }

    @PreRemove
    public void preRemove(SubCategory category) {
        //ApplicationEventPublisher.instance().publishEvent(event);
        logger.info("preRemove");
    }

    @PostRemove
    public void postRemove(SubCategory category) {
        // Update Redis cache
        logger.info("postRemove");
        subCategoryRedisService.clear();
    }
}
