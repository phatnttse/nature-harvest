// auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../configurations/auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }
}
