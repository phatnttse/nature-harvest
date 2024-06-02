import {
  ApplicationConfig,
  Provider,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TokenInterceptor } from './interceptors/token.interceptors';
import { provideClientHydration } from '@angular/platform-browser';

const tokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideToastr(),
    provideAnimations(),
    provideAnimationsAsync(),
    tokenInterceptorProvider,
    importProvidersFrom(HttpClientModule),
    provideClientHydration(),
  ],
};
