import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterLink} from "@angular/router";
import {environment} from "../../../environment";
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [FormsModule, RouterLink, HeaderComponent, FooterComponent],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {

    name = '';
    email = '';
    subject = '';
    message = '';

    submitted = false;

    readonly whatsappNumber = environment.phone_number;
    readonly emailAddress = environment.email;

    sendWhatsApp(): void {
        const message = `
Hoi Valley Road Bricks! 👋

Mijn naam is ${this.name || '[naam]'}.

Onderwerp: ${this.subject}

${this.message}

${this.email ? `Je kunt mij bereiken via: ${this.email}` : ''}
    `.trim();

        const url =
            `https://wa.me/${this.whatsappNumber}` +
            `?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    }

    sendEmail(): void {
        const subject =
            this.subject || 'Vraag aan Valley Road Bricks';

        const body = `
Hoi Valley Road Bricks,

Mijn naam is ${this.name || '[naam]'}.

${this.message}

Mijn e-mailadres:
${this.email}

Groeten,
${this.name}
    `.trim();

        const url =
            `mailto:${this.emailAddress}` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        window.location.href = url;
    }
}
