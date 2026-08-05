import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductComponent} from "../product/product.component";
import {CatalogueService} from "../../services/catalogue.service";

@Component({
    selector: 'app-products',
    imports: [
        ProductComponent
    ],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];

    constructor(private catalogueService: CatalogueService) {}

    ngOnInit(): void {
        this.catalogueService.getStarredProducts().subscribe(products => {
            this.products = products;
        });
    }

  onViewAll(): void {
    console.log('View all products clicked');
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product.name);
  }

  onWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
  }
}
