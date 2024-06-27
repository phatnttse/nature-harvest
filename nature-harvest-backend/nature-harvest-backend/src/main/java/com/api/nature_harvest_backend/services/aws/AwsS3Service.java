package com.api.nature_harvest_backend.services.aws;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AwsS3Service implements IAwsS3Service {

    private final AmazonS3 s3Client;

    public AwsS3Service(@Value("${aws.accessKeyId}") String accessKeyId,
                        @Value("${aws.secretKey}") String secretKey,
                        @Value("${aws.region}") String region) {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKeyId, secretKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }

    @Override
    public String uploadFile(MultipartFile file, String bucketName, String fileName) throws IOException {
        // Upload file lên S3 mà không thiết lập ACL
        s3Client.putObject(new PutObjectRequest(bucketName, fileName, file.getInputStream(), null));
        // Tạo URL của file
        return s3Client.getUrl(bucketName, fileName).toString();
    }

}
