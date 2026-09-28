import {
    Component,
    ElementRef,
    ViewChild,
    inject, OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {InvoiceService} from "../../services/invoice.service";
import {Invoice} from "../../models/invoice.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;


@Component({
    selector: 'app-invoice',
    standalone: true,
    imports: [
        CommonModule,
        FaIconComponent
    ],
    templateUrl: './invoice.component.html',
    styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

    private invoiceService = inject(InvoiceService);
    private route = inject(ActivatedRoute);

    @ViewChild('invoiceElement')
    invoiceElement!: ElementRef<HTMLElement>;

    invoice: Invoice | null = null;

    loading = true;
    error = '';

    async ngOnInit(): Promise<void> {

        const invoiceId =
            this.route.snapshot.paramMap.get('id');

        if (!invoiceId) {

            this.error =
                'Geen factuurnummer opgegeven.';

            this.loading = false;

            return;
        }

        await this.loadInvoice(invoiceId);
    }

    async loadInvoice(
        invoiceId: string
    ): Promise<void> {

        this.loading = true;
        this.error = '';

        try {

            this.invoice =
                await this.invoiceService.getInvoice(invoiceId);

            if (!this.invoice) {
                this.error =
                    'Factuur niet gevonden.';
            }

        } catch (error) {

            console.error(error);

            this.error =
                'De factuur kon niet worden geladen.';

        } finally {

            this.loading = false;
        }
    }

    print(): void {
        this.invoiceService.print();
    }

    async savePdf(): Promise<void> {

        if (!this.invoice || !this.invoiceElement) {
            return;
        }

        await this.invoiceService.saveAsPdf(
            this.invoiceElement.nativeElement,
            this.invoice.invoiceNumber
        );
    }

    formatPrice(value: number): string {

        return new Intl.NumberFormat(
            'nl-NL',
            {
                style: 'currency',
                currency: 'EUR'
            }
        ).format(value);
    }

    formatPublishedDate(timestamp: Timestamp | null | undefined): string {

        if (!timestamp) {
            return '';
        }

        return timestamp
            .toDate()
            .toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
    }

    protected readonly faCircleInfo = faCircleInfo;
}
