import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Models/product';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiURlProducts = environment.apiURl + 'products';

  constructor(private http: HttpClient) {}

  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if (categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(this.apiURlProducts, { params });
  }

  createProducts(product: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURlProducts, product);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURlProducts}/one/${productId}`);
  }

  deleteMultipleProduct(selectedProductsIds: any): Observable<any> {
    return this.http.delete<any>(`${this.apiURlProducts}/multiple`, {
      body: selectedProductsIds,
    });
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURlProducts}/${productId}`);
  }

  updateProduct(productId: string, product: FormData): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiURlProducts}/${productId}`,
      product
    );
  }

  getProductCount(): Observable<any> {
    return this.http.get<any>(`${this.apiURlProducts}/get/count`);
  }

  getFeaturedProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiURlProducts}/get/featured/${count}`
    );
  }
}
