import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import { Product, FilterOptions } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private products: Product[] = [
    {
      id: 1,
      name: 'LEGO® The Lord of the Rings: Minas Tirith™',
      image: '🚢',
      price: 20.00,
      pieces: 8278,
      minRentTime: 3,
      category: 'Icons',
      inStock: true,
        legoId: 11377
    },
    {
      id: 2,
      name: 'LEGO® Creator Camp Nou',
      image: '✈️',
      price: 20.00,
      pieces: 5509,
      minRentTime: 2,
      category: 'Creator',
      inStock: true,
        legoId: 10284
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
          legoId: 76968,
          starred: true,
      },
    {
      id: 4,
      name: 'De aarde en de maan in beweging',
      image: '🤖',
      price: 10,
      pieces: 526,
      minRentTime: 1,
      category: 'Technic',
      inStock: true,
        legoId: 42179
    },
    {
      id: 5,
      name: 'PAC-MAN arcade',
      image: '🏎️',
      price: 15.00,
      pieces: 2651,
      minRentTime: 2,
      category: 'Technic',
      inStock: true,
        legoId: 10323
    },
    {
      id: 6,
      name: 'LEGO® Harry Potter Kasteel Zweinstein™',
      image: '🏛️',
      price: 20.00,
      pieces: 6020,
      minRentTime: 3,
      category: 'Harry Potter™',
      inStock: true,
        legoId: 71043
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
          legoId: 71043,
          starred: true,
      },
    {
      id: 7,
      name: 'LEGO® Natuurhistorisch museum',
      image: '🚀',
      price: 15.00,
      pieces: 4014,
      minRentTime: 2,
      category: 'Icons',
      inStock: true,
        legoId: 10326
    },
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
          legoId: 80036,
          starred: true,
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
          legoId: 42128,
          starred: true,
      }
  ];

  private filteredProductsSubject = new BehaviorSubject<Product[]>(this.products);
  filteredProducts$ = this.filteredProductsSubject.asObservable();

  private filterOptionsSubject = new BehaviorSubject<FilterOptions>({
    categories: [],
    priceRange: [0, 100],
    piecesRange: [0, 10000],
    buildTimeRange: [0, 25],
    sortBy: 'popularity'
  });
  filterOptions$ = this.filterOptionsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<string[]>(
    Array.from(new Set(this.products.map(p => p.category)))
  );
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.applyFilters();
  }

  getProducts(): Observable<Product[]> {
    return this.filteredProducts$;
  }

    getStarredProducts(): Observable<Product[]> {
        return this.filteredProducts$.pipe(map(products => products.filter(product => product.starred)));
    }

  getFilterOptions(): Observable<FilterOptions> {
    return this.filterOptions$;
  }

  getCategories(): Observable<string[]> {
    return this.categoriesSubject.asObservable();
  }

  updateFilters(filters: Partial<FilterOptions>): void {
    const currentFilters = this.filterOptionsSubject.value;
    this.filterOptionsSubject.next({ ...currentFilters, ...filters });
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterOptionsSubject.next({
      categories: [],
      priceRange: [0, 100],
      piecesRange: [0, 10000],
      buildTimeRange: [0, 25],
      sortBy: 'popularity'
    });
    this.applyFilters();
  }

  private applyFilters(): void {
    const filters = this.filterOptionsSubject.value;
    let filtered = this.products;

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }

    // Filter by price range
    filtered = filtered.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filter by pieces range
    filtered = filtered.filter(
      p => p.pieces >= filters.piecesRange[0] && p.pieces <= filters.piecesRange[1]
    );

    // Filter by build time range
    filtered = filtered.filter(
      p => p.minRentTime >= filters.buildTimeRange[0] && p.minRentTime <= filters.buildTimeRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.reverse();
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
    }

    this.filteredProductsSubject.next(filtered);
  }
}
