import {
  ApplicationConfig,
  Provider,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TokenInterceptor } from './interceptors/token.interceptors';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { adminRoutes } from './components/admin/admin-routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FIRE_BASE } from './environments/environment.development';

const tokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(RouterModule.forChild(adminRoutes)),
    provideHttpClient(withFetch()),
    provideToastr(),
    provideAnimations(),
    provideAnimationsAsync(),
    tokenInterceptorProvider,
    importProvidersFrom(HttpClientModule),
    provideClientHydration(),
    importProvidersFrom(FeatherModule.pick(allIcons)),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: FIRE_BASE.firebaseConfig.apiKey,
        authDomain: FIRE_BASE.firebaseConfig.authDomain,
        projectId: FIRE_BASE.firebaseConfig.projectId,
        storageBucket: FIRE_BASE.firebaseConfig.storageBucket,
        messagingSenderId: FIRE_BASE.firebaseConfig.messagingSenderId,
        appId: FIRE_BASE.firebaseConfig.appId,
        measurementId: FIRE_BASE.firebaseConfig.measurementId,
      })
    ),
    provideAuth(() => getAuth()),
  ],
};
