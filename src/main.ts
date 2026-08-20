import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import {
    InMemoryScrollingFeature,
    InMemoryScrollingOptions,
    provideRouter,
    withInMemoryScrolling
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {environment} from "./environment";
import {getStorage, provideStorage} from "@angular/fire/storage";

const scrollConfig: InMemoryScrollingOptions = {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
    withInMemoryScrolling(scrollConfig);

bootstrapApplication(AppComponent, {
  providers: [
      provideZoneChangeDetection(),
      provideRouter(routes, inMemoryScrollingFeature),
      provideFirebaseApp(() =>
          initializeApp(environment.firebase)
      ),

      provideFirestore(() =>
          getFirestore()
      ),
      provideStorage(() => getStorage()),
  ]
}).catch(err => console.error(err));
