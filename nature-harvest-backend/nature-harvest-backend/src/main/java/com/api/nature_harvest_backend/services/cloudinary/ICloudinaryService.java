package com.api.nature_harvest_backend.services.cloudinary;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface ICloudinaryService {
    String upload(MultipartFile multipartFile) throws IOException;

    Map delete(String id) throws IOException;
}
