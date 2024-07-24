import { UpdatePictureDto } from './../dtos/user/update-picture.dto';
import { UpdateUserProfileDto } from './../dtos/user/update.dto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SignUpDto } from '../dtos/user/signup.dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginDto } from '../dtos/user/login.dto';
import { LoginResponse } from '../responses/user/login.response';
import { HttpUtilService } from './http.util.service';
import { DOCUMENT } from '@angular/common';
import { UserResponse } from '../responses/user/user.response';
import { environment } from '../environments/environment.development';
import { UserListResponse } from '../responses/user/user-list.response';
import { BaseResponse } from '../responses/base/base.response';
import { ChangePasswordDto } from '../dtos/user/change-password.dto';
import { ForgotPasswordDto } from '../dtos/user/forgot-password.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiBaseUrl = environment.apiBaseUrl;
  localStorage?: Storage;
  private userResponseSubject = new BehaviorSubject<UserResponse | null>(null);
  userResponse$ = this.userResponseSubject.asObservable();
  private verifiedSubject = new BehaviorSubject<boolean | null>(null);
  verifiedSubject$ = this.verifiedSubject.asObservable();

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
    const userResponse = this.getUserResponseFromLocalStorage();
    this.userResponseSubject.next(userResponse);
  }

  signUp(signUpDto: SignUpDto): Observable<BaseResponse> {
    debugger;
    return this.http.post<BaseResponse>(
      `${this.apiBaseUrl}/users/signup`,
      signUpDto,
      this.apiConfig
    );
  }

  login(loginDto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiBaseUrl}/users/login`,
      loginDto,
      this.apiConfig
    );
  }

  loginGoogle(googleToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiBaseUrl}/users/login-google`,
      {}, // Add a body if needed or keep it as an empty object
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${googleToken}`,
        }),
      }
    );
  }

  verifyEmail(token: string): Observable<BaseResponse> {
    const params = new HttpParams().set('token', token);
    return this.http.get<BaseResponse>(
      `${this.apiBaseUrl}/users/confirm-email`,
      {
        params,
      }
    );
  }
  resendVerificationEmail(email: string): Observable<BaseResponse> {
    const params = new HttpParams().set('email', email);
    return this.http.get<BaseResponse>(
      `${this.apiBaseUrl}/users/resend-verification-email`,
      {
        params,
      }
    );
  }

  getUserDetails(token: string): Observable<UserResponse> {
    debugger;
    return this.http.post<UserResponse>(`${this.apiBaseUrl}/users/details`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  getAllUsers(
    keyword: string,
    page: number,
    limit: number
  ): Observable<UserListResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<UserListResponse>(`${this.apiBaseUrl}/users`, {
      params,
      ...this.apiConfig,
    });
  }

  updatePicture(updatePictureDto: UpdatePictureDto): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.apiBaseUrl}/users/update-picture`,
      updatePictureDto
    );
  }

  updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto) {
    return this.http.patch<UserResponse>(
      `${this.apiBaseUrl}/users/${userId}`,
      updateUserProfileDto,
      this.apiConfig
    );
  }

  deleteUser(userId: string, active: number): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.apiBaseUrl}/users/block/${userId}/${active}`,
      this.apiConfig
    );
  }
  changePassword(
    changePasswordDto: ChangePasswordDto
  ): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.apiBaseUrl}/users/change-password`,
      changePasswordDto,
      this.apiConfig
    );
  }
  forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.apiBaseUrl}/users/forgot-password`,
      forgotPasswordDto,
      this.apiConfig
    );
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      debugger;
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      this.localStorage?.setItem('user', userResponseJSON);
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }
  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      return userResponse;
    } catch (error) {
      console.error(
        'Error retrieving user response from local storage:',
        error
      );
      return null;
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      this.localStorage?.removeItem('user');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }
  setUserResponse(userResponse: UserResponse) {
    debugger;
    this.userResponseSubject.next(userResponse);
    this.saveUserResponseToLocalStorage(userResponse);
  }
  clearUserResponse() {
    debugger;
    this.userResponseSubject.next(null);
    this.removeUserFromLocalStorage();
  }
}
