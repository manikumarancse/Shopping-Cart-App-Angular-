import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../shared/constant/data.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userId: string | null = sessionStorage.getItem('ID'); // Retrieve session ID
  cartItems: any[] = []; // Declare cartItems array
  totalPrice: number = 0; // Variable to store total price
  cartKey: string = ''; // Key for localStorage

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.cartKey = 'cart_' + this.userId;
      this.getCartItems();
    } else {
      console.error('No user ID found in session storage');
    }
  }

  getCartItems(): void {
    const storedItems = localStorage.getItem(this.cartKey);
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
    }
    this.calculateTotalPrice();
    this.cartService.updateCartItems(this.cartItems);
    
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (item.price ? +item.price : 0) * (item.quantity ? +item.quantity : 0), 
      0
    );
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
    this.cartService.updateTotalPrice(this.totalPrice);
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.calculateTotalPrice();
    this.cartService.updateCartItems(this.cartItems);
  }
  emptyCart(): void {
    this.cartItems = []; // Clear cart items
    localStorage.removeItem(this.cartKey); // Remove cart from local storage
    this.totalPrice = 0; // Reset total price
    this.cartService.updateTotalPrice(this.totalPrice); // Update total price in service
    this.cartService.updateCartItems(this.cartItems); // Update cart items in service
  }
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateCart();
  }
  updateCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.calculateTotalPrice();
    this.cartService.updateCartItems(this.cartItems);
  }
}
