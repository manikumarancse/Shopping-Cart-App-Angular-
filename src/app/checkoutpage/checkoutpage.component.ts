import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkoutpage',
  templateUrl: './checkoutpage.component.html',
  styleUrls: ['./checkoutpage.component.css']
})
export class CheckoutpageComponent implements OnInit {
  totalPrice: number = 0;
  checkoutForm!: FormGroup;


  constructor(private cartService: CartService,private formBuilder: FormBuilder,private router: Router) { 
    this.checkoutForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      Mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Pattern for 10 digits
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // Pattern for 6 digits
      nameoncard: ['', Validators.required],
      credit: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      CVV: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]], // Pattern for 3 or 4 digits
    });
  }

  ngOnInit(): void {
   
    this.cartService.totalPrice$.subscribe(totalPrice => {
      this.totalPrice = totalPrice;
    });
    
  }
  get f() { return this.checkoutForm.controls; }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', this.checkoutForm.value);
      alert('Order placed successfully!');
      
      // Clear local storage
      localStorage.clear();
      this.router.navigate(['/cart']);

    } else {
      // Form is invalid, mark all fields as touched to display error messages
      this.checkoutForm.markAllAsTouched();
    }
  }

}