import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { CartService } from '../services/cart.service';
import { ChangeDetectorRef } from '@angular/core';

import { CartItem } from '../shared/constant/data.model';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  showSearchBar: boolean = false;

  searchValue:string="";
  userId:string | null = '';
  LoginText:string = 'Login';
  formData:any;
  fname:string | null ='';
  lname:string | null =''; 
  userName:string ='';
  userProfile:string = 'user-profile-img profile';
  cartItemCount: number = 0;
  cartItems: any[] = []; // Declare cartItems array
  totalPrice: number = 0; // Variable to store total price
  cartKey: string = ''; // Key for localStorage

  constructor(private router: Router,private httpClient: HttpClient,private sharedService:SharedService,private cdr: ChangeDetectorRef,private cartService: CartService) {}


  ngOnInit() {
    this.cartService.currentCartItems.subscribe(cartItems => {
      this.cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    });
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL is the listing page
        this.showSearchBar = event.urlAfterRedirects.includes('/listing');
      }
      
    });


    this.userId = sessionStorage.getItem('ID');
    this.fname = sessionStorage.getItem('firstName');
    this.lname = sessionStorage.getItem('lastName');

    const formDataString = localStorage.getItem('formData');
    this.formData = formDataString ? JSON.parse(formDataString) as FormData : null;
    
    

    if(this.userId!=null && this.fname!=null && this.lname!=null){
      this.LoginText = 'Logout';
      const firstLetterFname = this.fname.charAt(0).toUpperCase();
      const firstLetterLname = this.lname.charAt(0).toUpperCase();
      this.userName = `${firstLetterFname}${firstLetterLname}`;    
      
      this.userProfile = 'user-profile-img profile block';
    }

    if (this.userId) {
      this.cartKey = 'cart_' + this.userId;
      this.getCartItems();
    } else {
      console.error('No user ID found in session storage');
    }

    this.sharedService.currentSearchTerm.subscribe(term => {
      this.searchValue = term;
      this.cdr.detectChanges();
    });



  }
  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.sharedService.updateSearchTerm(searchTerm);
  }
  getCartItems(): void {
    const storedItems = localStorage.getItem(this.cartKey);
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
    }
    this.cartService.updateCartItems(this.cartItems);
    
  }
  loginBtn(){
    if(this.userId!=null){
      this.formData[this.userId].login= 'inactive';
      localStorage.setItem('formData', JSON.stringify(this.formData));
      sessionStorage.clear();
    }
  }
}
