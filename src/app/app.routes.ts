import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import {ProductDetailComponent} from "./pages/product-detail/product-detail.component";
import {SetFormComponent} from "./admin/set-form/set-form.component";
import {OverviewComponent} from "./admin/overview/overview.component";
import {AboutUsComponent} from "./pages/about-us/about-us.component";
import {FaqComponent} from "./pages/faq/faq.component";

export const routes: Routes = [
    {
    path: '',
    component: HomeComponent,
    data: { title: 'Home - Valley Road Bricks' }
    },
    {
    path: 'onze-sets',
    component: CatalogueComponent,
    data: { title: 'Catalogue - Valley Road Bricks' }
    },
    {
        path: 'product/:id',
        component: ProductDetailComponent
    },
    {
    path: 'products',
    redirectTo: 'onze-sets',
    pathMatch: 'full'
    },
    // {
    // path: 'new',
    // component: HowItWorksComponent,
    // data: { title: 'Nieuwe Sets - Valley Road Bricks' }
    // },
    {
    path: 'hoe-het-werkt',
    component: HowItWorksComponent,
    data: { title: 'Hoe Werkt Huren - Valley Road Bricks' }
    },
    {
        path: 'over-ons',
        component: AboutUsComponent
    },
    {
        path: 'faq',
        component: FaqComponent
    },
    {
        path: 'admin',
        children: [
            {
                path: 'overview',
                component: OverviewComponent,
            },
            {
                path: 'new-form',
                component: SetFormComponent,
            },
            {
                path: 'products/:id',
                component: SetFormComponent,
                pathMatch: 'full'
            }
        ]
    },
];
