// auth.config.ts
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  redirectUri: 'http://localhost:4200/login',
  clientId:
    '719610777931-mg76eb0o0a84ffqodcc6n91b9pln3f31.apps.googleusercontent.com',
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
  requireHttps: false,
};
