export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  pieces: number;
  buildTime: number;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  piecesRange: [number, number];
  buildTimeRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'popularity' | 'newest';
}
