import {ChangeDetectorRef, Component, inject, Input} from '@angular/core';
import {ImageCarouselComponent} from "../../components/image-carousel/image-carousel.component";
import {Product} from "../../models/product.model";
import {FooterComponent} from "../../components/footer/footer.component";
import {HeaderComponent} from "../../components/header/header.component";
import {ActivatedRoute} from "@angular/router";
import {filter, map, switchMap} from "rxjs";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {
    faCheck,
    faChevronLeft,
    faCross,
    faHashtag,
    faHouseChimneyCrack,
    faLeaf,
    faX
} from "@fortawesome/free-solid-svg-icons";
import {ProductService} from "../../services/product.service";
import {RentalRequestModalComponent} from "../../components/rental-request.modal/rental-request.modal.component";
import {Location} from "@angular/common";
import {RentalsService} from "../../services/rentals.service";
import {Rental} from "../../models/rental.model";

@Component({
  selector: 'app-product-detail',
    imports: [
        ImageCarouselComponent,
        FooterComponent,
        HeaderComponent,
        FaIconComponent,
        RentalRequestModalComponent
    ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
    private activatedRoute = inject(ActivatedRoute);
    private productService = inject(ProductService);
    private rentalsService = inject(RentalsService);
    private location = inject(Location);
    @Input() product!: Product;

    showRentalModal = false;
    rentals: Rental[] = [];

    constructor(private cdr: ChangeDetectorRef) {
        // Access route parameters
        if(!this.product) {
            this.activatedRoute.params
                .pipe(
                    switchMap(params => this.productService.getProductByLink(params['id'])),
                    filter(product => !!product),
                    map(product => {
                        if(product) {
                            this.product = product
                        }
                        return product;
                    }),
                    switchMap(product => this.rentalsService.getActiveRentalsForSet(product!.id!)),
                )
                .subscribe((rentals) => {
                    if (rentals && rentals.length > 0) {
                        this.rentals = rentals;
                        this.cdr.detectChanges()
                    }
                });
        }
    }

    protected readonly faCircleCheck = faCircleCheck;
    protected readonly faHashtag = faHashtag;
    protected readonly faChevronLeft = faChevronLeft;
    protected readonly faLeaf = faLeaf;
    protected readonly faHouseChimneyCrack = faHouseChimneyCrack;
    protected readonly faCheck = faCheck;

    back() {
        this.location.back()
    }

    formatDisplayDate(
        date: string
    ): string {

        if (!date) {
            return '';
        }

        const parts =
            date.split('-');

        if (parts.length !== 3) {
            return date;
        }

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    protected readonly faCross = faCross;
    protected readonly faX = faX;
}
