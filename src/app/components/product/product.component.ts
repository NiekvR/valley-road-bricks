import {Component, Input} from '@angular/core';
import {Product} from "../../models/product.model";
import {ImageCarouselComponent} from "../image-carousel/image-carousel.component";
import {RouterLink} from "@angular/router";
import {RentalRequestModalComponent} from "../rental-request.modal/rental-request.modal.component";

@Component({
  selector: 'app-product',
    imports: [
        ImageCarouselComponent,
        RouterLink,
        RentalRequestModalComponent
    ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
    @Input() product!: Product;
    showRentalModal = false;
}
