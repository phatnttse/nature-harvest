package com.api.nature_harvest_backend.components.converters;

import com.api.nature_harvest_backend.models.Order;
import org.springframework.kafka.support.converter.JsonMessageConverter;
import org.springframework.kafka.support.mapping.DefaultJackson2JavaTypeMapper;
import org.springframework.kafka.support.mapping.Jackson2JavaTypeMapper;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class OrderMessageConverter extends JsonMessageConverter {
    public OrderMessageConverter() {
        super();
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        typeMapper.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID);
        typeMapper.addTrustedPackages("com.api.nature_harvest_backend");
        typeMapper.setIdClassMapping(Collections.singletonMap("order", Order.class));
        this.setTypeMapper(typeMapper);
    }

}
