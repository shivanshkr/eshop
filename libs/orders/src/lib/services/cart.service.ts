import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../Models/cart';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject({});
  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const initialCart = {
        items: [],
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem(CART_KEY, initialCartJson);
    } else {
      this.cart$.next(cart);
    }
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart: Cart = this.getCart();
    const cartItemExist = cart.items?.find(
      (item) => item.productId === cartItem.productId
    );
    if (cartItemExist) {
      cart.items?.map((item) => {
        if (item.productId === cartItem.productId) {
          if (updateCartItem) {
            item.quantity = cartItem?.quantity as number;
          } else {
            item.quantity =
              (item.quantity as number) + (cartItem?.quantity as number);
          }
        }
        return item;
      });
    } else {
      cart.items?.push(cartItem);
    }

    const cartString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartString);
    this.cart$.next(cart);
    return cart;
  }

  getCart(): Cart {
    const cart: Cart = JSON.parse(localStorage.getItem(CART_KEY) as string);
    return cart;
  }

  deleteCartItem(productId: string) {
    const cart: Cart = this.getCart();
    const newCart: Cart = {
      items: cart.items?.filter((item) => item.productId !== productId),
    };
    const newCartString = JSON.stringify(newCart);
    localStorage.setItem(CART_KEY, newCartString);
    this.cart$.next(newCart);
    return newCart;
  }

  emptyCart() {
    const initialCart = {
      items: [],
    };
    const initialCartJson = JSON.stringify(initialCart);
    localStorage.setItem(CART_KEY, initialCartJson);
    this.cart$.next(initialCart);
  }
}
