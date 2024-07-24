//package com.api.nature_harvest_backend.configurations;
//
//import org.apache.kafka.clients.admin.NewTopic;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.core.KafkaOperations;
//import org.springframework.kafka.listener.CommonErrorHandler;
//import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
//import org.springframework.kafka.listener.DefaultErrorHandler;
//import org.springframework.util.backoff.FixedBackOff;
//
//@Configuration
//public class KafkaConfiguration {
//    @Bean
//    public CommonErrorHandler errorHandler(KafkaOperations<Object, Object> template) {
//        return new DefaultErrorHandler(
//                new DeadLetterPublishingRecoverer(template), new FixedBackOff(1000L, 2));
//    }
//
//    @Bean
//    public NewTopic createAOrderTopic() {
//        return new NewTopic("create-a-order", 1, (short) 1);
//    }
//}
