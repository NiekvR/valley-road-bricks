import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Product} from "../../models/product.model";
import {ProductService} from "../../services/product.service";
import {RouterLink} from "@angular/router";
import {map} from "rxjs";
import {CustomDatepickerComponent } from "../../shared/custom-datepicker/custom-datepicker.component";
import {Rental} from "../../models/rental.modal";
import {RentalsService} from "../../services/rentals.service";

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        CustomDatepickerComponent
    ],
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    private productService = inject(ProductService);
    private rentalsService = inject(RentalsService);

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
        phoneNumber: '',
        startDate: '',
        endDate: '',
        weeks: 0,
        disassemblyService: false,
        sortingPlates: false
    };

    readonly sortingPlatesPrice = 5;

    rentalWeekOptions: number[] = Array.from(
        { length: 10 + 1 },
        (_, index) => index
    );

    categories: string[] = [];

    ngOnInit(): void {
        this.loadProducts();
        this.loadRentals();
    }

    get baseRentalPrice(): number {

        if (!this.selectedProduct) {
            return 0;
        }

        return (
            this.selectedProduct.price *
            this.rental.weeks
        );
    }

    get disassemblyPrice(): number {

        if (
            !this.selectedProduct ||
            !this.rental.disassemblyService
        ) {
            return 0;
        }

        // Afbreekservice = één extra week huur
        return this.selectedProduct.price;
    }

    get sortingPlatesPriceTotal(): number {

        return this.rental.sortingPlates
            ? this.sortingPlatesPrice
            : 0;
    }

    get rentalPrice(): number {

        return (
            this.baseRentalPrice +
            this.disassemblyPrice +
            this.sortingPlatesPriceTotal
        );
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


    loadRentals(): void {

        this.rentalsService.getActiveRentals().subscribe({
            next: data => {

                this.rentals = data as Rental[];

            },

            error: error => {

                console.error(
                    'Error loading rentals:',
                    error
                );

            }
        });
    }

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
            phoneNumber: '',
            startDate: '',
            endDate: '',
            weeks: 0,
            disassemblyService: false,
            sortingPlates: false
        };

        this.initializeRental()

        this.showRentalModal = true;
    }

    closeRentalModal(): void {

        this.showRentalModal = false;
        this.selectedProduct = null;

    }

    initializeRental(): void {

        if (!this.selectedProduct) {
            return;
        }

        this.rental.weeks = this.selectedProduct.minRentTime;

        this.rental.disassemblyService = false;
        this.rental.sortingPlates = false;

        this.updateRentalDates();
    }

    updateRentalDates(date?: string | null): void {
        if (!this.rental.startDate || !this.rental.weeks) {
            this.rental.endDate = '';
            return;
        }

        const start = !!date ? date : this.rental.startDate as Date | string;
        const startDate = start instanceof Date ?
            new Date(start.getFullYear(), start.getMonth(), start.getDate()) :
            new Date(`${this.rental.startDate}T00:00:00`);

        const endDate = new Date(startDate);

        endDate.setDate(
            endDate.getDate() +
            (this.rental.weeks * 7)
        );

        this.rental.endDate =
            this.formatDateForInput(endDate);
    }

    private formatDateForInput(date: Date): string {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0');

        const day = String(
            date.getDate()
        ).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    async createRental(): Promise<void> {

        if (
            !this.selectedProduct ||
            !this.rental.customerName ||
            !this.rental.startDate ||
            !this.rental.weeks
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

        const rental: Rental = {

            setId: this.selectedProduct.id!,

            setName: this.selectedProduct.name,

            customerName:
            this.rental.customerName,

            phoneNumber: this.rental.phoneNumber,

            startDate: this.rental.startDate,

            endDate: this.rental.endDate,

            weeks: this.rental.weeks,

            disassemblyService: this.rental.disassemblyService,

            sortingPlates: this.rental.sortingPlates,

            status: 'active',

            createdAt: new Date()
        };

        try {

            await this.rentalsService.addRental(rental);

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

    getRentalForSet(setId: string): Rental | undefined {
        const today = this.formatDate(
            new Date()
        );

        return this.rentals.find(rental =>
            rental.setId === setId &&
            rental.status === 'active' &&
            rental.endDate >= today
        );
    }

    getRentalsForSet(
        setId: string
    ): Rental[] | undefined {

        const today = this.formatDate(
            new Date()
        );

        return this.rentals.filter(rental =>
            rental.setId === setId &&
            rental.status === 'active' &&
            rental.endDate >= today
        );
    }

    getRentedDates(setId: string): { start: Date | string, end: Date | string } [] {
        return (this.getRentalsForSet(setId) || []).map(rental => {
            return { start: this.subtractSevenDays(rental.startDate), end: rental.endDate };
        })
    }

    subtractSevenDays(input: Date | string): Date {
        const date = typeof input === 'string' ? new Date(input) : new Date(input);

        // Create a new date to avoid mutating the original
        const result = new Date(date);
        result.setDate(result.getDate() - 7);

        // Normalize to midnight (optional but recommended)
        result.setHours(0, 0, 0, 0);

        return result;
    }

    isRented(setId: string): boolean {

        return !!this.getRentalForSet(
            setId
        );
    }

    getStatus(set: Product): string {

        const rental =
            this.getRentalForSet(set.id!);

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
            ((set.minRentTime || 1) * 7)
        );

        return this.formatDate(date);
    }

    formatDate(date: Date): string {

        return date
            .toISOString()
            .split('T')[0];
    }

    formatDatestringToDate(date: string): Date {

        return new Date(date)
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
