import { Component } from '@angular/core';

import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductsComponent } from '../../components/products/products.component';
import { ProcessComponent } from '../../components/process/process.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-home',
    imports: [
    HeaderComponent,
    HeroComponent,
    ProductsComponent,
    ProcessComponent,
    NewsletterComponent,
    FooterComponent
],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  cartCount: number = 0;
}
