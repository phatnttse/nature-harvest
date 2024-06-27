package com.api.nature_harvest_backend.services.aws;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IAwsS3Service {
    String uploadFile(MultipartFile file, String bucketName, String fileName) throws IOException;
}
