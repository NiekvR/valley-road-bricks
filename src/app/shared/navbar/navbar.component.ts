import {Component, Input, signal} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faSearch, faCartShopping} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    menuOpen = signal(false);

    @Input() cartCount: number = 1;

    readonly links = [
        { label: 'Home', link: '/' },
        { label: 'Sets', link: '/onze-sets' },
        // { label: 'Nieuwe sets', link: '/new' },
        { label: 'Hoe werkt huren?', link: '/hoe-het-werkt' },
        { label: 'Over ons', link: '/over-ons' },
        { label: 'Nieuws', link: '/nieuws' },
        { label: 'FAQ', link: '/faq' },
        { label: 'Contact', link: '/contact' }
    ];


    toggleMenu() {
        this.menuOpen.update(open => !open);
    }

    closeMenu() {
        this.menuOpen.set(false);
    }

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
