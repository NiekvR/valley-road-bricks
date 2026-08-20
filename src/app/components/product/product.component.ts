import {Component, Input} from '@angular/core';
import {Product} from "../../models/product.model";
import {NgOptimizedImage} from "@angular/common";
import {ImageCarouselComponent} from "../image-carousel/image-carousel.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-product',
    imports: [
        ImageCarouselComponent,
        RouterLink
    ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
    @Input() product!: Product;

    onAddToCart(product: Product) {}

}
