import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../Models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [],
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  constructor(private productService: ProductsService) {}
  featuredProducts: Product[] = [];
  endSubs$: Subject<any> = new Subject();

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  _getFeaturedProducts() {
    this.productService
      .getFeaturedProducts(4)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => (this.featuredProducts = res));
  }
  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
