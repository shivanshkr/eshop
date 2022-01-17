import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../Models/cart';
import { User, UsersService } from '@bluebits/users';
import { OrderPost } from '../../Models/order';
import { OrderItemsPost } from '../../Models/order-items';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent implements OnInit {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService
  ) {}
  checkoutFormGroup: FormGroup = new FormGroup({});
  isSubmitted = false;
  orderItems: OrderItemsPost[] = [];
  userId = '';
  countries: { id?: string; name?: string }[] = [];

  ngOnInit(): void {
    this._initCheckoutForm();
    this._autoFillUserData();
    this._getCartItems();
    this._getCountries();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['IN', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required],
    });
  }

  private _autoFillUserData() {
    this.usersService.observeCurrentUser().subscribe((user) => {
      if (user) {
        this.userId = user.id as string;
        this.checkoutForm.name.setValue(user?.name);
        this.checkoutForm.email.setValue(user?.email);
        this.checkoutForm.phone.setValue(user?.phone);
        this.checkoutForm.city.setValue(user?.city);
        this.checkoutForm.country.setValue(user?.country);
        this.checkoutForm.zip.setValue(user?.zip);
        this.checkoutForm.street.setValue(user?.street);
        this.checkoutForm.apartment.setValue(user?.apartment);
      }
    });
  }

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = [];
    cart.items?.map((item) => {
      this.orderItems.push({
        product: item.productId,
        quantity: item.quantity,
      });
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    console.log(this.checkoutFormGroup);
    if (this.checkoutFormGroup.invalid) {
      return;
    }
    const order: OrderPost = {
      orderItems: this.orderItems,
      status: 0,
      shippingAddress1: this.checkoutForm.street.value,
      shippingAddress2: this.checkoutForm.apartment.value,
      city: this.checkoutForm.city.value,
      zip: this.checkoutForm.zip.value,
      country: this.checkoutForm.country.value,
      phone: this.checkoutForm.phone.value,
      user: this.userId,
      dateOrdered: `${Date.now()}`,
    };
    this.ordersService.createOrders(order).subscribe(
      (res) => {
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
      },
      () => {
        //error msg
      }
    );
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
