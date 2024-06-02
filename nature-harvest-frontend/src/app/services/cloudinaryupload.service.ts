import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryUploadService {
  constructor(private http: HttpClient) {}

  uploadImage(image: any): Observable<any> {
    const data = image;
    return this.http.post(
      'https://api.cloudinary.com/v1_1/dl3rsgucq/image/upload',
      data
    );
  }
}
