import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../Models/user';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup = new FormGroup({});
  isSubmitted = false;
  errMsg!: string;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private localstorageService: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.isSubmitted = true;
    this.errMsg = '';
    if (this.loginFormGroup.invalid) {
      return;
    }
    this.auth
      .login(
        this.loginFormGroup.value.email,
        this.loginFormGroup.value.password
      )
      .subscribe(
        (user: User) => {
          this.localstorageService.setToken(user.token);
          this.router.navigate(['/']);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.errMsg = err.error;
          if (err.status !== 400) {
            this.errMsg = 'Error in the server, please try again later!';
          }
        }
      );
  }
}
