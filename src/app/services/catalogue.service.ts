import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, FilterOptions } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private products: Product[] = [
    {
      id: 1,
      name: 'LEGO® Icons Titanic',
      image: '🚢',
      price: 29.95,
      pieces: 9090,
      buildTime: 14,
      category: 'Icons',
      rating: 4.9,
      reviews: 450,
      inStock: true
    },
    {
      id: 2,
      name: 'LEGO® Icons Concorde',
      image: '✈️',
      price: 24.95,
      pieces: 2083,
      buildTime: 14,
      category: 'Icons',
      rating: 4.8,
      reviews: 320,
      inStock: true
    },
    {
      id: 3,
      name: 'LEGO® Technic Land Rover Defender 90',
      image: '🚙',
      price: 22.95,
      pieces: 2573,
      buildTime: 14,
      category: 'Technic',
      rating: 4.7,
      reviews: 280,
      inStock: true
    },
    {
      id: 4,
      name: 'LEGO® Star Wars™ R2-D2',
      image: '🤖',
      price: 19.95,
      pieces: 2314,
      buildTime: 14,
      category: 'Star Wars',
      rating: 4.9,
      reviews: 520,
      inStock: true
    },
    {
      id: 5,
      name: 'LEGO® Technic Ferrari SF90 Stradale',
      image: '🏎️',
      price: 34.95,
      pieces: 3778,
      buildTime: 16,
      category: 'Technic',
      rating: 4.8,
      reviews: 410,
      inStock: true
    },
    {
      id: 6,
      name: 'LEGO® Icons Colosseum',
      image: '🏛️',
      price: 39.95,
      pieces: 9036,
      buildTime: 18,
      category: 'Icons',
      rating: 4.9,
      reviews: 380,
      inStock: true
    },
    {
      id: 7,
      name: 'LEGO® Star Wars™ Millennium Falcon',
      image: '🚀',
      price: 44.95,
      pieces: 7541,
      buildTime: 20,
      category: 'Star Wars',
      rating: 4.9,
      reviews: 650,
      inStock: true
    },
    {
      id: 8,
      name: 'LEGO® Technic Excavator',
      image: '🏗️',
      price: 15.95,
      pieces: 1109,
      buildTime: 10,
      category: 'Technic',
      rating: 4.6,
      reviews: 190,
      inStock: true
    },
    {
      id: 9,
      name: 'LEGO® Icons Big Ben',
      image: '🕐',
      price: 29.95,
      pieces: 4163,
      buildTime: 15,
      category: 'Icons',
      rating: 4.8,
      reviews: 340,
      inStock: true
    },
    {
      id: 10,
      name: 'LEGO® Star Wars™ Death Star',
      image: '⭐',
      price: 49.95,
      pieces: 4016,
      buildTime: 18,
      category: 'Star Wars',
      rating: 4.9,
      reviews: 580,
      inStock: false
    },
    {
      id: 11,
      name: 'LEGO® Technic Bugatti Bolide',
      image: '🏎️',
      price: 42.95,
      pieces: 3599,
      buildTime: 17,
      category: 'Technic',
      rating: 4.9,
      reviews: 470,
      inStock: true
    },
    {
      id: 12,
      name: 'LEGO® Icons Eiffel Tower',
      image: '🗼',
      price: 32.95,
      pieces: 3428,
      buildTime: 16,
      category: 'Icons',
      rating: 4.8,
      reviews: 390,
      inStock: true
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
      p => p.buildTime >= filters.buildTimeRange[0] && p.buildTime <= filters.buildTimeRange[1]
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
        filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }

    this.filteredProductsSubject.next(filtered);
  }
}
