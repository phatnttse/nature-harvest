package com.api.nature_harvest_backend.services.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService implements ICloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        Map<String, String> valuesMap = new HashMap<>();
        valuesMap.put("cloud_name", cloudName);
        valuesMap.put("api_key", apiKey);
        valuesMap.put("api_secret", apiSecret);
        cloudinary = new Cloudinary(valuesMap);
    }

    @Override
    public String upload(MultipartFile multipartFile) throws IOException {
        // Define transformation parameters for cropping
        Transformation transformation = new Transformation()
                .width(288)
                .height(288)
                .crop("fill");

        // Upload file to Cloudinary with transformation using byte array
        String url = (String) cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.asMap(
                "transformation", transformation,
                "resource_type", "auto" // Ensure correct resource type is detected
        )).get("secure_url");

        return url;
    }


    @Override
    public Map delete(String id) throws IOException {
        return cloudinary.uploader().destroy(id, ObjectUtils.emptyMap());
    }

//    private File convert(MultipartFile multipartFile) throws IOException {
//        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
//        try (FileOutputStream fo = new FileOutputStream(file)) {
//            fo.write(multipartFile.getBytes());
//        }
//        return file;
//    }
}
