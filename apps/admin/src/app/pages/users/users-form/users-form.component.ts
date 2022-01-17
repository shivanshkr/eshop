import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import * as countriesLib from 'i18n-iso-countries';

declare const require: any;

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [],
})
export class UsersFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isSubmitted = false;
  editMode = false;
  userId = '';
  countries: { id?: string; name?: string }[] = [];
  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initUserForm();
    this._checkEditMode();
    this._getCountries();
  }

  private _getCountries() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    // this.countries = Object.entries(
    //   countriesLib.getNames('en', { select: 'official' })
    // ).map((entry) => {
    //   return {
    //     id: entry[0],
    //     name: entry[1],
    //   };
    // });
    // console.log(this.countries);
    this.countries = this.userService.getCountries();
  }
  private _initUserForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: [''],
    });
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.userId = params.id;
        this.userService.getUser(params.id).subscribe(
          (res) => {
            this.form.controls.name.setValue(res.name);
            this.form.controls.email.setValue(res.email);
            this.form.controls.phone.setValue(res.phone);
            this.form.controls.isAdmin.setValue(res.isAdmin);
            this.form.controls.street.setValue(res.street);
            this.form.controls.apartment.setValue(res.apartment);
            this.form.controls.zip.setValue(res.zip);
            this.form.controls.city.setValue(res.city);
            this.form.controls.country.setValue(res.country);

            this.form.controls.password.setValidators([]);
            this.form.controls.password.updateValueAndValidity();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User not found!',
            });
            timer(2000)
              .toPromise()
              .then(() => {
                this.router.navigate(['/users']);
              });
          }
        );
      }
    });
  }

  onSubmit() {
    console.log(this.form);
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      isAdmin: this.form.controls.isAdmin.value,
      street: this.form.controls.street.value,
      apartment: this.form.controls.apartment.value,
      zip: this.form.controls.zip.value,
      city: this.form.controls.city.value,
      country: this.form.controls.country.value,
      password: this.form.controls.password.value,
    };
    if (this.editMode) {
      this._updateUser(user);
    } else {
      this._createUser(user);
    }
  }

  private _createUser(user: User) {
    this.userService.createUser(user).subscribe(
      (user: User) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${user.name} is created!`,
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
          detail: 'User is not created!',
        });
      }
    );
  }

  private _updateUser(user: User) {
    this.userService.updateUser(this.userId, user).subscribe(
      (user: User) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${user.name} is Updated!`,
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
          detail: 'User is not Updated!',
        });
      }
    );
  }
}
