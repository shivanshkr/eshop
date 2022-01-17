/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../Models/category';
import { Product } from '../../Models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategories: string[] = [];
  isCategoryPage = false;
  constructor(
    private PS: ProductsService,
    private CS: CategoriesService,
    private route: ActivatedRoute
  ) {}
  endSubs$: Subject<any> = new Subject();

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      params.id ? this._getProducts([params.id]) : this._getProducts();
      params.id ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
    });
    this._getCategories();
  }

  _getProducts(categoriesFilter?: string[]) {
    this.PS.getProducts(categoriesFilter)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => (this.products = res));
  }

  _getCategories() {
    this.CS.getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => (this.categories = res));
  }

  categoryFilter() {
    console.log(this.selectedCategories);
    this._getProducts(this.selectedCategories);
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
