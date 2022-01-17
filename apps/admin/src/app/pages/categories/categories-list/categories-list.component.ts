import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import {
  ConfirmationService,
  // ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endSubs$: Subject<unknown> = new Subject();

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getCategories();
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => {
        this.categories = res;
      });
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe(
          (category: Category) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Category ${category.name} is Deleted!`,
            });
            this._getCategories();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category is not Deleted!',
            });
          }
        );
      },
      // reject: (type: any) => {
      //   switch (type) {
      //     case ConfirmEventType.REJECT:
      //       this.messageService.add({
      //         severity: 'error',
      //         summary: 'Rejected',
      //         detail: 'You have rejected',
      //       });
      //       break;
      //     case ConfirmEventType.CANCEL:
      //       this.messageService.add({
      //         severity: 'warn',
      //         summary: 'Cancelled',
      //         detail: 'You have cancelled',
      //       });
      //       break;
      //   }
      // },
    });
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
