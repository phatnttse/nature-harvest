//package com.api.nature_harvest_backend.listener;
//
//import com.api.nature_harvest_backend.models.Order;
//import org.springframework.kafka.annotation.KafkaHandler;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.stereotype.Component;
//
//
//@Component
//@KafkaListener(id = "nature_harvest_group", topics = "create-a-order")
//public class MyKafkaListener {
//    @KafkaHandler
//    public void listenOrder(Order order) {
//        System.out.println("Received: " + order);
//    }
//
//    @KafkaHandler(isDefault = true)
//    public void unknown(Object object) {
//        System.out.println("Received unknown: " + object);
//    }
//
//}
