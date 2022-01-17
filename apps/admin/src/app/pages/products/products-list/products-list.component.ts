import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: Product[] = [];

  constructor(
    private productService: ProductsService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts() {
    this.productService.getProducts().subscribe((res) => {
      this.products = res;
    });
  }

  deleteProduct(productId: string, productName: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this Product ${productName} ?`,
      header: `Delete Product ${productName}`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(productId).subscribe(
          (product: Product) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Product ${product.name} is Deleted!`,
            });
            this._getProducts();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product is not Deleted!',
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

  updateProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`);
  }

  refreshProducts() {
    this._getProducts();
    this.messageService.add({
      severity: 'success',
      summary: 'Refreshed',
      detail: `Product List Updated`,
      life: 2000,
    });
  }
  deleteSelectedProducts() {
    console.log(this.selectedProducts);
    const selectedProductsLength = this.selectedProducts.length;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <b>${selectedProductsLength}</b> selected products?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const selectedProductsIds = this.selectedProducts.map(
          (product) => product.id
        );
        const selectedProductsIdsObj = {
          ids: selectedProductsIds,
        };
        this.productService
          .deleteMultipleProduct(selectedProductsIdsObj)
          .subscribe(() => {
            this.selectedProducts = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: `${selectedProductsLength} Products Deleted`,
              life: 3000,
            });
            this._getProducts();
          });
      },
    });
  }
}
