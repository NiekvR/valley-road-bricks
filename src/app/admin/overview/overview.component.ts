import {Component, OnInit, inject, EnvironmentInjector} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    Firestore,
    collection,
    collectionData,
    addDoc,
} from '@angular/fire/firestore';

import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {RouterLink} from "@angular/router";
import {map} from "rxjs";

export interface Rental {
    id?: number;
    setId: number;
    setName: string;
    customerName: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'returned' | 'cancelled';
    createdAt: Date;
}

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    private firestore = inject(Firestore);
    private injector = inject(EnvironmentInjector);
    private productService = inject(ProductService);

    products: Product[] = [];
    rentals: Rental[] = [];

    filteredProducts: Product[] = [];

    search = '';
    selectedCategory = '';

    loading = true;

    showRentalModal = false;

    selectedProduct: Product | null = null;

    rental = {
        customerName: '',
        endDate: ''
    };

    categories: string[] = [];

    ngOnInit(): void {
        this.loadProducts();
        // this.loadRentals();
    }

    loadProducts(): void {

        this.productService.getProducts()
            .pipe(map(products => this.products = products.sort((a, b) => (a.localId || 1000) - (b.localId || 1000))))
            .subscribe({

                next: data => {

                    this.products =
                        data as Product[];

                    this.categories = [
                        ...new Set(
                            this.products
                                .map(set => set.category)
                                .filter(Boolean)
                        )
                    ];

                    this.applyFilters();

                    this.loading = false;
                },

                error: error => {

                    console.error(
                        'Error loading sets:',
                        error
                    );

                    this.loading = false;
                }

            });
    }


    // loadRentals(): void {
    //
    //     const rentalsRef = collection(
    //         this.firestore,
    //         'rentals'
    //     );
    //
    //     collectionData(
    //         rentalsRef,
    //         {
    //             idField: 'id'
    //         }
    //     ).subscribe({
    //         next: data => {
    //
    //             this.rentals = data as Rental[];
    //
    //         },
    //
    //         error: error => {
    //
    //             console.error(
    //                 'Error loading rentals:',
    //                 error
    //             );
    //
    //         }
    //     });
    // }

    applyFilters(): void {

        const search = this.search
            .toLowerCase()
            .trim();

        this.filteredProducts = this.products.filter(set => {

            const matchesSearch =
                !search ||
                set.name.toLowerCase().includes(search) ||
                String(set.legoId).includes(search);

            const matchesCategory =
                !this.selectedCategory ||
                set.category === this.selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });
    }

    openRentalModal(set: Product): void {

        this.selectedProduct = set;

        this.rental = {
            customerName: '',
            endDate: this.getDefaultEndDate(set)
        };

        this.showRentalModal = true;
    }

    closeRentalModal(): void {

        this.showRentalModal = false;
        this.selectedProduct = null;

    }

    async createRental(): Promise<void> {

        if (
            !this.selectedProduct ||
            !this.rental.customerName ||
            !this.rental.endDate
        ) {
            return;
        }

        const today = new Date();
        const endDate = new Date(
            this.rental.endDate
        );

        if (endDate <= today) {

            alert(
                'De einddatum moet in de toekomst liggen.'
            );

            return;
        }

        const rentalsRef = collection(
            this.firestore,
            'rentals'
        );

        const rental: Rental = {

            setId: this.selectedProduct.id,

            setName: this.selectedProduct.name,

            customerName:
            this.rental.customerName,

            startDate:
                this.formatDate(today),

            endDate:
            this.rental.endDate,

            status: 'active',

            createdAt: new Date()
        };

        try {

            await addDoc(
                rentalsRef,
                rental
            );

            this.closeRentalModal();

        } catch (error) {

            console.error(
                'Error creating rental:',
                error
            );

            alert(
                'Er ging iets mis bij het verhuren van de set.'
            );

        }
    }

    getRentalForSet(
        setId: number
    ): Rental | undefined {

        const today = this.formatDate(
            new Date()
        );

        return this.rentals.find(rental =>
            rental.setId === setId &&
            rental.status === 'active' &&
            rental.endDate >= today
        );
    }

    isRented(setId: number): boolean {

        return !!this.getRentalForSet(
            setId
        );
    }

    getStatus(set: Product): string {

        const rental =
            this.getRentalForSet(set.id);

        if (rental) {
            return 'Verhuurd';
        }

        if (!set.inStock) {
            return 'Niet beschikbaar';
        }

        return 'Beschikbaar';
    }

    getDefaultEndDate(
        set: Product
    ): string {

        const date = new Date();

        date.setDate(
            date.getDate() +
            (set.minRentTime || 1)
        );

        return this.formatDate(date);
    }

    formatDate(date: Date): string {

        return date
            .toISOString()
            .split('T')[0];
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
}
