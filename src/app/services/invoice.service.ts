import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    where
} from '@angular/fire/firestore';

import { Invoice, InvoiceLine } from '../models/invoice.model';
import {Rental} from "../models/rental.model";

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    private firestore = inject(Firestore);

    /**
     * Maak een factuur op basis van een rental.
     *
     * Belangrijk:
     * De prijzen worden hier als snapshot opgeslagen.
     * Als jullie prijzen later veranderen, verandert een bestaande
     * factuur daardoor niet.
     */
    async createInvoice(
        rental: Rental,
        deposit = 35
    ): Promise<Invoice> {

        if (!rental.id) {
            throw new Error('Rental heeft geen ID.');
        }

        const invoiceNumber = await this.generateInvoiceNumber(rental.localSetId);

        const lines: InvoiceLine[] = [];

        // Huurprijs
        const rentalTotal = rental.weeklyPrice * rental.weeks;

        lines.push({
            description: `LEGO-set huur – ${rental.setName} (${rental.weeks} ${rental.weeks === 1 ? 'week' : 'weken'})`,
            quantity: rental.weeks,
            unitPrice: rental.weeklyPrice,
            total: rentalTotal
        });

        // Afbreekservice
        if (rental.disassemblyService) {
            const disassemblyPrice =
                rental.disassemblyPrice ?? rental.weeklyPrice;

            lines.push({
                description: 'Afbreekservice',
                quantity: 1,
                unitPrice: disassemblyPrice,
                total: disassemblyPrice
            });
        }

        // Sorteerplaten
        if (rental.sortingPlates) {
            const sortingPrice =
                rental.sortingPlatesPrice ?? 5;

            lines.push({
                description: 'Sorteerplaten',
                quantity: 1,
                unitPrice: sortingPrice,
                total: sortingPrice
            });
        }

        const subtotal = lines.reduce(
            (sum, line) => sum + line.total,
            0
        );

        const invoice: Invoice = {
            invoiceNumber,
            rentalId: String(rental.id),

            customerName: rental.customerName,
            phoneNumber: rental.phoneNumber,

            setId: rental.setId,
            localSetId: rental.localSetId,
            setName: rental.setName,

            rentalStartDate: rental.startDate,
            rentalEndDate: rental.endDate,
            weeks: rental.weeks,

            disassemblyService: rental.disassemblyService,
            sortingPlates: rental.sortingPlates,

            lines,

            subtotal,
            total: subtotal,

            deposit,

            createdAt: new Date(),
            updatedAt: new Date()
        };

        const invoiceRef = doc(
            collection(this.firestore, 'invoices')
        );

        invoice.id = invoiceRef.id;

        await setDoc(invoiceRef, invoice);

        return invoice;
    }

    /**
     * Factuur ophalen.
     */
    async getInvoice(id: string): Promise<Invoice | null> {

        const invoiceRef = doc(
            this.firestore,
            'invoices',
            id
        );

        const snapshot = await getDoc(invoiceRef);

        if (!snapshot.exists()) {
            return null;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        } as Invoice;
    }

    /**
     * Zoek factuur die bij een rental hoort.
     */
    async getInvoiceByRentalId(
        rentalId: string
    ): Promise<Invoice | null> {

        const invoicesRef = collection(
            this.firestore,
            'invoices'
        );

        const q = query(
            invoicesRef,
            where('rentalId', '==', rentalId),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const invoiceDoc = snapshot.docs[0];

        return {
            id: invoiceDoc.id,
            ...invoiceDoc.data()
        } as Invoice;
    }

    /**
     * Genereer een leesbaar factuurnummer.
     *
     * Voorbeeld:
     * VRB-2026-0001
     */
    private async generateInvoiceNumber(localSetId: number): Promise<string> {

        const year = new Date().getFullYear();

        const invoicesRef = collection(
            this.firestore,
            'invoices'
        );

        const q = query(
            invoicesRef,
            where('localSetId', '==', localSetId),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);

        let nextNumber = 1;

        if (!snapshot.empty) {
            const lastInvoice = snapshot.docs[0].data() as Invoice;

            const match = lastInvoice.invoiceNumber?.match(
                /VRB-\d{4}-(\d+)$/
            );

            if (match) {
                nextNumber = Number(match[1]) + 1;
            }
        }

        return `${year}${String(localSetId).padStart(2, '0')}${String(nextNumber).padStart(2, '0')}`;
    }

    /**
     * Open de browser printdialoog.
     */
    print(): void {
        window.print();
    }

    /**
     * Maak PDF van het factuur-element.
     */
    async saveAsPdf(
        element: HTMLElement,
        invoiceNumber: string
    ): Promise<void> {

        const [{ default: html2canvas }, { default: jsPDF }] =
            await Promise.all([
                import('html2canvas'),
                import('jspdf')
            ]);

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;

        const usableWidth = pageWidth - (margin * 2);
        const maxFileSize = 1024 * 1024; // 1 MB

        /*
         * 1.5 is een goede balans tussen:
         * - leesbaarheid
         * - PDF grootte
         *
         * 2.0 zoals je nu gebruikt levert een veel grotere afbeelding op.
         */
        const canvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        const imageHeight =
            (canvas.height * usableWidth) / canvas.width;

        /*
         * Probeer verschillende JPEG-kwaliteiten.
         * We beginnen relatief hoog en gaan steeds verder
         * comprimeren totdat de PDF onder 1 MB komt.
         */
        const qualities = [
            0.75,
            0.65,
            0.55,
            0.45,
            0.35,
            0.25
        ];

        let pdf: InstanceType<typeof jsPDF> | null = null;
        let pdfBlob: Blob | null = null;

        for (const quality of qualities) {

            /*
             * JPEG in plaats van PNG.
             *
             * quality:
             * 0.75 = zeer goede kwaliteit
             * 0.55 = goede kwaliteit voor facturen
             * 0.35 = sterke compressie
             */
            const imageData =
                canvas.toDataURL(
                    'image/jpeg',
                    quality
                );

            pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            let heightLeft = imageHeight;
            let position = margin;

            /*
             * Alias zorgt ervoor dat jsPDF dezelfde afbeelding
             * kan hergebruiken op volgende pagina's.
             */
            const imageAlias = 'invoice-image';

            pdf.addImage(
                imageData,
                'JPEG',
                margin,
                position,
                usableWidth,
                imageHeight,
                imageAlias,
                'FAST'
            );

            heightLeft -= pageHeight - margin * 2;

            while (heightLeft > 0) {

                position =
                    heightLeft -
                    imageHeight +
                    margin;

                pdf.addPage();

                pdf.addImage(
                    imageData,
                    'JPEG',
                    margin,
                    position,
                    usableWidth,
                    imageHeight,
                    imageAlias,
                    'FAST'
                );

                heightLeft -= pageHeight - margin * 2;
            }

            /*
             * Eerst als Blob genereren zodat we de werkelijke
             * bestandsgrootte kunnen controleren.
             */
            pdfBlob = pdf.output('blob');

            console.log(
                `PDF kwaliteit ${quality}:`,
                `${(pdfBlob.size / 1024).toFixed(0)} KB`
            );

            if (pdfBlob.size <= maxFileSize) {
                break;
            }

            /*
             * Nog te groot → volgende kwaliteit proberen.
             */
            pdf = null;
        }

        if (!pdf || !pdfBlob) {
            throw new Error(
                'De PDF kon niet worden gegenereerd.'
            );
        }

        /*
         * Controle.
         */
        if (pdfBlob.size > maxFileSize) {
            console.warn(
                `PDF is nog steeds groter dan 1 MB: ` +
                `${(pdfBlob.size / 1024 / 1024).toFixed(2)} MB`
            );
        }

        pdf.save(
            `${invoiceNumber}.pdf`
        );
    }
}
