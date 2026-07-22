import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  pieces: number;
  buildTime: number;
  badge?: string;
  category: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'LEGO® Icons Titanic',
      image: '🚢',
      price: 29.95,
      pieces: 9090,
      buildTime: 14,
      badge: 'Beschikbaar',
      category: 'Icons'
    },
    {
      id: 2,
      name: 'LEGO® Icons Concorde',
      image: '✈️',
      price: 24.95,
      pieces: 2083,
      buildTime: 14,
      badge: 'Beschikbaar',
      category: 'Icons'
    },
    {
      id: 3,
      name: 'LEGO® Technic Land Rover Defender 90',
      image: '🚙',
      price: 22.95,
      pieces: 2573,
      buildTime: 14,
      badge: 'Beschikbaar',
      category: 'Technic'
    },
    {
      id: 4,
      name: 'LEGO® Star Wars™ R2-D2',
      image: '🤖',
      price: 19.95,
      pieces: 2314,
      buildTime: 14,
      badge: 'Beschikbaar',
      category: 'Star Wars'
    }
  ];

  onViewAll(): void {
    console.log('View all products clicked');
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product.name);
  }

  onWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
  }
}
