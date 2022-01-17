import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../Models/category';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  apiURlCategories = environment.apiURl + 'categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURlCategories);
  }

  createCategories(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURlCategories, category);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURlCategories}/${categoryId}`);
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURlCategories}/${categoryId}`);
  }

  updateCategory(categoryId: string, category: Category): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiURlCategories}/${categoryId}`,
      category
    );
  }
}
