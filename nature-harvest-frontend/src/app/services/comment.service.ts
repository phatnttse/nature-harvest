import { CommentDto } from './../dtos/order/comment.dto';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { environment } from '../environments/environment.development';
import { OrderAndOrderDetailsResponse } from '../responses/order/order-orderdetails-response';
import { CommentListResponse } from '../responses/comment/comment-list.response';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiBaseUrl = environment.apiBaseUrl;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  comment(commentDto: CommentDto): Observable<OrderAndOrderDetailsResponse[]> {
    return this.http.post<OrderAndOrderDetailsResponse[]>(
      `${this.apiBaseUrl}/comments`,
      commentDto,
      this.apiConfig
    );
  }

  getComments(
    productId: number,
    page: number,
    limit: number
  ): Observable<CommentListResponse> {
    const params = new HttpParams()
      .set('productId', productId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<CommentListResponse>(`${this.apiBaseUrl}/comments`, {
      params,
    });
  }
}
