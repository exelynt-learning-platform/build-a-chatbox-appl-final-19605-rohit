import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { chatReducer } from './store/chat.reducer';
import { chatFeatureKey } from './store/chat.state';
import { ChatEffects } from './store/chat.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ [chatFeatureKey]: chatReducer }),
    provideEffects([ChatEffects])
  ]
};
