import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  ProductsService,
  Product,
  Category,
  CategoriesService,
} from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [],
})
export class ProductsFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isSubmitted = false;
  editMode = false;
  productId = '';
  categories: Category[] = [];
  imageDisplay: string | ArrayBuffer | undefined | null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._checkEditMode();
    this._getCategories();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      console.log(this.form.value);
      return;
    }

    const productFormData = new FormData();

    Object.keys(this.form.value).map((key) => {
      productFormData.append(key, this.form.value[key]);
    });
    if (this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._createProduct(productFormData);
    }
  }

  private _createProduct(productFormData: FormData) {
    this.productsService.createProducts(productFormData).subscribe(
      (product: Product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product ${product.name} is created!`,
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product is not created!',
        });
      }
    );
  }

  private _updateProduct(productFormData: FormData) {
    this.productsService
      .updateProduct(this.productId, productFormData)
      .subscribe(
        (product: Product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} is updated!`,
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not updated!',
          });
        }
      );
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
  }

  private _initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      rating: [''],
      numReview: [''],
      isFeatured: [false],
    });
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.productId = params.id;
        this.productsService.getProduct(params.id).subscribe(
          (res) => {
            this.form.controls.name.setValue(res.name);
            this.form.controls.description.setValue(res.description);
            this.form.controls.richDescription.setValue(res.richDescription);
            this.form.controls.brand.setValue(res.brand);
            this.form.controls.price.setValue(res.price);
            this.form.controls.category.setValue(res.category?.id);
            this.form.controls.countInStock.setValue(res.countInStock);
            // this.form.controls.rating.setValue(res.rating);
            // this.form.controls.numReview.setValue(res.numReview);
            this.form.controls.isFeatured.setValue(res.isFeatured);
            this.imageDisplay = res.image;
            this.form.controls.image.setValidators([]);
            this.form.controls.image.updateValueAndValidity();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product not found!',
            });
            timer(2000)
              .toPromise()
              .then(() => {
                this.router.navigate(['/products']);
              });
          }
        );
      }
    });
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe((res) => {
      this.categories = res;
    });
  }
}
