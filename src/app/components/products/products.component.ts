import { Component } from '@angular/core';
import {Product} from "../../models/product.model";
import {ProductComponent} from "../product/product.component";

@Component({
    selector: 'app-products',
    imports: [
        ProductComponent
    ],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products: Product[] = [
      {
          id: 8,
          name: 'LEGO® De Lantaarnstad',
          image: 'assets/img/products/Lantaarnstad/Lantaarnstad-1.webp',
          images: [
              'assets/img/products/Lantaarnstad/Lantaarnstad-1.webp',
              'assets/img/products/Lantaarnstad/Lantaarnstad-2.webp',
              'assets/img/products/Lantaarnstad/Lantaarnstad-3.webp'
          ],
          price: 10,
          pieces: 2187,
          minRentTime: 2,
          category: 'Monkie Kid™',
          inStock: true,
          legoId: 80036
      },
      {
          id: 6,
          name: 'LEGO® Harry Potter Kasteel Zweinstein™',
          image: '🏛️',
          images: [
              'assets/img/products/Zweinstein/Zweinsteinkasteel-1.jpg',
              'assets/img/products/Zweinstein/Zweinsteinkasteel-2.jpg',
              'assets/img/products/Zweinstein/Zweinsteinkasteel-3.jpg',
              'assets/img/products/Zweinstein/Zweinsteinkasteel-4.jpg',
              'assets/img/products/Zweinstein/Zweinsteinkasteel-5.jpg',
              'assets/img/products/Zweinstein/Zweinsteinkasteel-6.jpg'
          ],
          price: 20.00,
          pieces: 6020,
          minRentTime: 3,
          category: 'Harry Potter™',
          inStock: true,
          legoId: 71043
      },
      {
          id: 3,
          name: 'Dinosaurusfossielen: Tyrannosaurus rex',
          image: '🚙',
          images: [
              'assets/img/products/T-Rex/T-Rex-1.webp',
              'assets/img/products/T-Rex/T-Rex-2.webp',
              'assets/img/products/T-Rex/T-Rex-3.webp'
          ],
          price: 15.00,
          pieces: 2651,
          minRentTime: 2,
          category: 'Jurassic World™',
          inStock: true,
          legoId: 76968
      },
      {
          id: 9,
          name: 'Robuuste sleepwagen',
          image: '🕐',
          images: [
              'assets/img/products/Sleepwagen/Robuuste-sleepwagen-1.jpg',
              'assets/img/products/Sleepwagen/Robuuste-sleepwagen-2.jpg',
              'assets/img/products/Sleepwagen/Robuuste-sleepwagen-3.jpg',
              'assets/img/products/Sleepwagen/Robuuste-sleepwagen-4.webp'
          ],
          price: 10,
          pieces: 2017,
          minRentTime: 2,
          category: 'Technic',
          inStock: true,
          legoId: 42128
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
