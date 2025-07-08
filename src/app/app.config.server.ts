// src/app/app.config.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient } from '@angular/common/http'; // Often needed here if not merged correctly

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Ensure provideHttpClient() is available for the server bundle.
    // It might be implicitly provided through mergeApplicationConfig,
    // but if the error persists, explicitly adding it here might help.
    // provideHttpClient()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);