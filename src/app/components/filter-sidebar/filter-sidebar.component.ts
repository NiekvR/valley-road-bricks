import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogueService } from '../../services/catalogue.service';
import { FilterOptions } from '../../models/product.model';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
  categories: string[] = [];
  selectedCategories: string[] = [];
  priceRange: [number, number] = [0, 100];
  piecesRange: [number, number] = [0, 10000];
  buildTimeRange: [number, number] = [0, 25];
  sortBy: 'price-asc' | 'price-desc' | 'popularity' | 'newest' = 'popularity';

  constructor(private catalogueService: CatalogueService) {}

  ngOnInit(): void {
    this.catalogueService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onCategoryChange(category: string, event: any): void {
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onPiecesRangeChange(): void {
    this.applyFilters();
  }

  onBuildTimeRangeChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onResetFilters(): void {
    this.selectedCategories = [];
    this.priceRange = [0, 100];
    this.piecesRange = [0, 10000];
    this.buildTimeRange = [0, 25];
    this.sortBy = 'popularity';
    this.catalogueService.resetFilters();
  }

  private applyFilters(): void {
    this.catalogueService.updateFilters({
      categories: this.selectedCategories,
      priceRange: this.priceRange,
      piecesRange: this.piecesRange,
      buildTimeRange: this.buildTimeRange,
      sortBy: this.sortBy
    });
  }
}
