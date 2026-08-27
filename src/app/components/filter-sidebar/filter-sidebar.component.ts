import {Component, inject, OnInit} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CatalogueService } from '../../services/catalogue.service';
import { FilterOptions } from '../../models/product.model';
import {ProductService} from "../../services/product.service";
import {take} from "rxjs";

@Component({
    selector: 'app-filter-sidebar',
    imports: [FormsModule],
    templateUrl: './filter-sidebar.component.html',
    styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
    private catalogueService = inject(CatalogueService);
    private productService = inject(ProductService);
  categories: string[] = [];
  selectedCategories: string[] = [];
  prices: number[] = [10,15,20];
  selectedPrices: number[] = [];
  piecesRange: [number, number] = [0, 10000];
  buildTimeRange: [number, number] = [0, 4];
  sortBy: 'a-z' | 'z-a' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc' | 'newest' = 'a-z';
  mobileFiltersOpen = false;

  ngOnInit(): void {
    this.productService.getProducts().pipe(take(1)).subscribe(products => {
      this.categories = [... new Set(products.map(product => product.category).filter(category => !!category))];
    });
  }

    toggleMobileFilters(): void {
        this.mobileFiltersOpen = !this.mobileFiltersOpen;
    }

  onCategoryChange(category: string, event: any): void {
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.applyFilters();
  }

  onPriceRangeChange(price: number, event: any): void {
      if (event.target.checked) {
          this.selectedPrices.push(price);
      } else {
          this.selectedPrices = this.selectedPrices.filter(c => c !== price);
      }
    this.applyFilters();
  }

  onPiecesRangeChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onResetFilters(): void {
    this.selectedCategories = [];
    this.selectedPrices = [];
    this.piecesRange = [0, 10000];
    this.buildTimeRange = [0, 25];
    this.sortBy = 'a-z';
    this.catalogueService.resetFilters();
  }

  private applyFilters(): void {
    this.catalogueService.updateFilters({
      categories: this.selectedCategories,
      prices: this.selectedPrices,
      piecesRange: this.piecesRange,
      buildTimeRange: this.buildTimeRange,
      sortBy: this.sortBy
    });
  }
}
