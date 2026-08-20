import {Component, inject, Input} from '@angular/core';
import {ImageCarouselComponent} from "../../components/image-carousel/image-carousel.component";
import {Product} from "../../models/product.model";
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {
    faCheck,
    faChevronLeft,
    faClock,
    faHashtag,
    faHouseChimneyCrack,
    faLeaf
} from "@fortawesome/free-solid-svg-icons";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-product-detail',
    imports: [
        ImageCarouselComponent,
        FooterComponent,
        HeaderComponent,
        FaIconComponent
    ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
    private activatedRoute = inject(ActivatedRoute);
    private productService = inject(ProductService);
    @Input() product!: Product;

    constructor() {
        // Access route parameters
        if(!this.product) {
            this.activatedRoute.params
                .pipe(
                    switchMap(params => this.productService.getProductByLink(params['id']))
                )
                .subscribe((product) => {
                    console.log(product);
                    if (product) {
                        this.product = product;
                    }
                });
        }
    }

    protected readonly faCircleCheck = faCircleCheck;
    protected readonly faClock = faClock;
    protected readonly faHashtag = faHashtag;
    protected readonly faChevronLeft = faChevronLeft;
    protected readonly faLeaf = faLeaf;
    protected readonly faHouseChimneyCrack = faHouseChimneyCrack;
    protected readonly faCheck = faCheck;
}
