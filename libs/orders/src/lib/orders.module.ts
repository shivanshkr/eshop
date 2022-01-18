import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { BadgeModule } from 'primeng/badge';
import { CartComponent } from './pages/cart/cart.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { AuthGuardNgshopGuard } from '@bluebits/users';
export const ordersRoutes: Route[] = [];

const routes: Routes = [
  { path: 'cart', component: CartComponent },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [AuthGuardNgshopGuard],
  },
  { path: 'success', component: ThankYouComponent },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BadgeModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
  ],
  declarations: [
    CartIconComponent,
    CartComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankYouComponent,
  ],
  exports: [
    CartIconComponent,
    CartComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankYouComponent,
  ],
})
export class OrdersModule {
  constructor(cartService: CartService) {
    cartService.initCartLocalStorage();
  }
}
