import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [],
})
export class CategoriesFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isSubmitted = false;
  editMode = false;
  categoryId = '';

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['', Validators.required],
    });
    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const category: Category = {
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
      color: this.form.controls.color.value,
    };
    if (this.editMode) {
      this._updateCategory(category);
    } else {
      this._createCategory(category);
    }
  }

  private _createCategory(category: Category) {
    this.categoriesService.createCategories(category).subscribe(
      (category: Category) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Category ${category.name} is created!`,
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
          detail: 'Category is not created!',
        });
      }
    );
  }

  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(this.categoryId, category).subscribe(
      (category: Category) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Category ${category.name} is Updated!`,
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
          detail: 'Category is not Updated!',
        });
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.categoryId = params.id;
        this.categoriesService.getCategory(params.id).subscribe(
          (res) => {
            this.form.controls.name.setValue(res.name);
            this.form.controls.icon.setValue(res.icon);
            this.form.controls.color.setValue(res.color);
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category not found!',
            });
            timer(2000)
              .toPromise()
              .then(() => {
                this.router.navigate(['/categories']);
              });
          }
        );
      }
    });
  }
}
