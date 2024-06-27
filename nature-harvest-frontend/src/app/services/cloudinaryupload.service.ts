import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryUploadService {
  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  uploadImage(image: any): Observable<any> {
    const data = image;
    return this.http.post(
      'https://cors-anywhere.herokuapp.com/https://api.cloudinary.com/v1_1/dlpust9lj/image/upload',
      data
    );
  }
}
