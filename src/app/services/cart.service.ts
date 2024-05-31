import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../shared/constant/data.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  currentCartItems = this.cartItems.asObservable();
  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();


  constructor() {
    this.loadInitialCartItems();
  }

  private loadInitialCartItems() {
    const userId = sessionStorage.getItem('ID');
    if (userId) {
      const cartKey = 'cart_' + userId;
      const storedItems = localStorage.getItem(cartKey);
      if (storedItems) {
        this.cartItems.next(JSON.parse(storedItems));
      }
    }
  }

  updateCartItems(items: CartItem[]) {
    this.cartItems.next(items);
    this.saveCartItems(items);
    this.calculateTotalPrice(); // Update total price when cart items change
  }

  addToCart(newItem: CartItem) {
    const currentItems = this.cartItems.getValue();
    const existingItemIndex = currentItems.findIndex(item => item.productId === newItem.productId);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += newItem.quantity;
    } else {
      currentItems.push(newItem);
    }

    this.updateCartItems(currentItems);
  }
  updateTotalPrice(totalPrice: number) {
    this.totalPriceSubject.next(totalPrice);
  }

  private saveCartItems(items: CartItem[]) {
    const userId = sessionStorage.getItem('ID');
    if (userId) {
      const cartKey = 'cart_' + userId;
      localStorage.setItem(cartKey, JSON.stringify(items));
    }
  }
  getTotalPrice(): number {
    return this.totalPriceSubject.value;
  }
  calculateTotalPrice() {
    const items = this.cartItems.getValue();
    const totalPrice = items.reduce((total, item) => total + (item.price ? +item.price : 0) * (item.quantity ? +item.quantity : 0), 0);
    this.totalPriceSubject.next(totalPrice);
  }

}
