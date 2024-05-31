import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.css']
})
export class SingleproductComponent implements OnInit {

  singleproductId: string | null = null;
  name: any;
  thumbnail: any;
  price: number = 0;

  singleResult: any = null;
  mainImage: string = '';
  userId: string | null = sessionStorage.getItem('ID'); // Retrieve session ID
    isAdditionalInfoVisible: boolean = false; // To track visibility

  cartItemCount: any;
  cartItems: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,private cartService: CartService,
    private location: Location,
    
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleproductId = params.get('singleproductId');
      if (this.singleproductId) {
        this.fetchSingleProduct(this.singleproductId);
      }
    });
  }

  fetchSingleProduct(singleproductId: string): void {
    this.httpClient.get<any>(`https://dummyjson.com/products/${singleproductId}`).subscribe(
      (single) => {
        this.singleResult = single;
        this.mainImage = single.thumbnail;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onImageClick(imageUrl: string) {
    this.singleResult.thumbnail = imageUrl;
  }

  addToCart(): void {
    if (!this.userId) {
      alert('Please log in to add items to the cart.');
      return;
    }

    const cartKey = 'cart_' + this.userId;

 
     this.cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingItemIndex = this.cartItems.findIndex((item:any) => item.productId === this.singleproductId);

    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity++;
    } else {
      this.cartItems.push({
        productId: this.singleproductId,
        name: this.singleResult.title,
        thumbnail: this.singleResult.thumbnail,
        price: this.singleResult.price,
        quantity: 1
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(this.cartItems));

    alert('Product added to cart successfully!');
 
this.cartService.updateCartItems(this.cartItems);
  }
   backClicked() {
    // this.location.back();
    const cat = sessionStorage.getItem('category');
    this.router.navigate(['/listing', cat]);
  }

  toggleAdditionalInfo() {
    this.isAdditionalInfoVisible = !this.isAdditionalInfoVisible;
  }
}
