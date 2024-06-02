//package com.api.nature_harvest_backend.services.product;
//
//import com.api.nature_harvest_backend.responses.product.ProductResponse;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import org.springframework.data.domain.PageRequest;
//
//import java.util.List;
//
//public interface IProductRedisService {
//    //Clear cached data in Redis
//    void clear();//clear cache
//    List<ProductResponse> getAllProducts(
//            String keyword,
//            Long categoryId,Long subcategoryId, PageRequest pageRequest) throws JsonProcessingException;
//    void saveAllProducts(List<ProductResponse> productResponses,
//                         String keyword,
//                         Long categoryId,
//                         PageRequest pageRequest) throws JsonProcessingException;
//}
