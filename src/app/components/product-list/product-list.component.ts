import { Component, OnInit } from '@angular/core';

import { Product } from '../../models/product.model';
import { CatalogueService } from '../../services/catalogue.service';
import {ProductComponent} from "../product/product.component";

@Component({
    selector: 'app-product-list',
    imports: [
        ProductComponent
    ],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredCount: number = 0;

  constructor(private catalogueService: CatalogueService) {}

  ngOnInit(): void {
    this.catalogueService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredCount = products.length;
    });
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product.name);
  }

  onWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}
