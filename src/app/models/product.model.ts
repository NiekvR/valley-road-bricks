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
  nearlyInStock?: boolean;
  link?: string;
  description?: string;
  localId?: number;
}

export interface FilterOptions {
  categories: string[];
  prices: number[];
  piecesRange: [number, number];
  buildTimeRange: [number, number];
  sortBy: 'a-z' | 'z-a' | 'price-asc' | 'price-desc' | 'newest';
}
