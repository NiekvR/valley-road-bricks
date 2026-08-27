import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {environment} from "../../../environment";

export interface RentalRequest {
    startDate: string;
    weeks: number;
}

@Component({
    selector: 'app-rental-request-modal',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './rental-request.modal.component.html',
    styleUrl: './rental-request.modal.component.scss'
})
export class RentalRequestModalComponent {

    @Input() visible = false;

    @Input() set: any;

    @Output() closed = new EventEmitter<void>();

    startDate = '';
    weeks = 2;

    readonly whatsappNumber = environment.phone_number;
    readonly emailAddress = environment.email;

    close(): void {
        this.closed.emit();
    }

    get minimumDate(): string {
        const today = new Date();

        return today.toISOString().split('T')[0];
    }

    requestViaWhatsApp(): void {
        if (!this.startDate) {
            return;
        }

        const message = `
Hoi Valley Road Bricks! 👋

Ik wil graag de volgende LEGO-set huren:

🧱 ${this.set.name}
🔢 LEGO ${this.set.legoId}

📅 Gewenste startdatum: ${this.formatDate(this.startDate)}
⏱️ Huurperiode: ${this.weeks} weken

Kunnen jullie aangeven of de set beschikbaar is?

Alvast bedankt!
    `.trim();

        const url =
            `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    }

    requestViaEmail(): void {
        if (!this.startDate) {
            return;
        }

        const subject =
            `Huur-aanvraag LEGO ${this.set.legoId} – ${this.set.name}`;

        const body = `
Hoi Valley Road Bricks,

Ik wil graag de volgende LEGO-set huren:

Set: ${this.set.name}
LEGO nummer: ${this.set.legoId}

Gewenste startdatum: ${this.formatDate(this.startDate)}
Huurperiode: ${this.weeks} weken

Ik hoor graag of de set beschikbaar is.

Groeten,
    `.trim();

        const url =
            `mailto:${this.emailAddress}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        window.location.href = url;
    }

    private formatDate(date: string): string {
        const parsedDate = new Date(date);

        return parsedDate.toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}
