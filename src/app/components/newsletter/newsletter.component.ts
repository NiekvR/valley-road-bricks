import { Component } from '@angular/core';
import { CommonModule, FormsModule } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
  email: string = '';
  submitted: boolean = false;

  onSubscribe(): void {
    if (this.email) {
      console.log('Subscribed with:', this.email);
      this.submitted = true;
      this.email = '';
      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    }
  }
}
