import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home - Valley Road Bricks' }
  },
  {
    path: 'catalogue',
    component: CatalogueComponent,
    data: { title: 'Catalogue - Valley Road Bricks' }
  },
  {
    path: 'products',
    redirectTo: 'catalogue',
    pathMatch: 'full'
  },
  {
    path: 'new',
    component: HowItWorksComponent,
    data: { title: 'Nieuwe Sets - Valley Road Bricks' }
  },
  {
    path: 'how-it-works',
    component: HowItWorksComponent,
    data: { title: 'Hoe Werkt Huren - Valley Road Bricks' }
  }
];
