export interface Product {
  id: number;
  name: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  pieces: number;
  minRentTime: number;
  category: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  legoId: number;
  starred?: boolean;
}

export interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  piecesRange: [number, number];
  buildTimeRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'popularity' | 'newest';
}
