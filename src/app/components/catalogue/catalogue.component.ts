import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FilterSidebarComponent,
    ProductListComponent
  ],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent {}
