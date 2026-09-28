import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Rental} from "../../models/rental.model";
import {RentalsService} from "../../services/rentals.service";
import {InvoiceService} from "../../services/invoice.service";

type RentalFilter =
    | 'all'
    | 'active'
    | 'returned'
    | 'cancelled';

@Component({
    selector: 'app-rentals',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './rentals.component.html',
    styleUrl: './rentals.component.scss'
})
export class RentalsComponent implements OnInit {
    private rentalsService = inject(RentalsService);
    private invoiceService = inject(InvoiceService);

    rentals: Rental[] = [];

    selectedRental: Rental | null = null;

    activeFilter: RentalFilter = 'all';

    searchTerm = '';

    loading = false;


    ngOnInit(): void {
        this.loadRentals();
    }


    loadRentals(): void {

        this.loading = true;

        this.rentalsService.getRentals().subscribe({
          next: rentals => {
              console.log(rentals);
            this.rentals = rentals;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });

    }


    get filteredRentals(): Rental[] {

        return this.rentals.filter(rental => {

            const matchesFilter =
                this.activeFilter === 'all' ||
                rental.status === this.activeFilter;

            const search =
                this.searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                rental.customerName
                    .toLowerCase()
                    .includes(search) ||
                rental.setName
                    .toLowerCase()
                    .includes(search) ||
                rental.setId
                    .toLowerCase()
                    .includes(search);

            return matchesFilter && matchesSearch;
        });

    }


    selectRental(rental: Rental): void {
        this.selectedRental = rental;
    }


    closeDetails(): void {
        this.selectedRental = null;
    }


    setFilter(filter: RentalFilter): void {
        this.activeFilter = filter;
    }


    getStatusLabel(status: Rental['status']): string {

        switch (status) {

            case 'active':
                return 'Actief';

            case 'returned':
                return 'Geretourneerd';

            case 'cancelled':
                return 'Geannuleerd';

        }

    }


    formatDate(date: string): string {

        if (!date) {
            return '-';
        }

        return new Intl.DateTimeFormat('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));

    }


    calculateTotal(rental: Rental): number {

        const rentalPrice =
            rental.weeklyPrice * rental.weeks;

        const disassembly =
            rental.disassemblyService
                ? rental.disassemblyPrice
                : 0;

        const sorting =
            rental.sortingPlates
                ? rental.sortingPlatesPrice
                : 0;

        return rentalPrice + disassembly + sorting;
    }


    async openInvoice(rental: Rental): Promise<void> {

        try {

            let invoice =
                await this.invoiceService.getInvoiceByRentalId(
                    String(rental.id)
                );

            // Nog geen factuur?
            if (!invoice) {

                invoice =
                    await this.invoiceService.createInvoice(rental);
            }

            // Factuurpagina openen
            window.open(
                `/admin/invoices/${invoice.id}`,
                '_blank'
            );

        } catch (error) {

            console.error(
                'Factuur kon niet worden aangemaakt',
                error
            );

        }
    }

}
