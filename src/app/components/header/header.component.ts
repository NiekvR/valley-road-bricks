import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-header',
    imports: [],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() cartCount: number = 0;

  menuItems = [
    { label: 'Home', link: '/' },
    { label: 'Catalogue', link: '/products' },
    { label: 'Nieuwe sets', link: '/new' },
    { label: 'Hoe werkt huren?', link: '/how-it-works' },
    { label: 'Over ons', link: '/about' },
    { label: 'FAQ', link: '/faq' },
    { label: 'Contact', link: '/contact' }
  ];

  onSearch(): void {
    console.log('Search clicked');
  }

  onAccount(): void {
    console.log('Account clicked');
  }

  onCart(): void {
    console.log('Cart clicked');
  }
}
