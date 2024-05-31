import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  categoriesList: string[] = [];
  productList: { [key: string]: Product[] } = {};

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getCategoriesList();
  }

  getCategoriesList(): void {
    this.httpClient.get<string[]>('https://dummyjson.com/products/category-list').subscribe((categories: string[]) => {
      this.categoriesList = categories;
      this.getProductListsForCategories();
    });
  }

  getProductListsForCategories(): void {
    this.categoriesList.forEach((category: string) => {
      this.httpClient.get<{ products: Product[] }>(`https://dummyjson.com/products/category/${category}`).subscribe((result: { products: Product[] }) => {
        if (result.products && result.products.length > 0) {
          this.productList[category] = result.products;
        }
      });
    });
  }

  getFirstProductForCategory(category: string): Product | null {
    if (this.productList[category] && this.productList[category].length > 0) {
      let lowestPriceProduct = this.productList[category][0];
      for (let product of this.productList[category]) {
        if (product.price < lowestPriceProduct.price) {
          lowestPriceProduct = product;
        }
      }
      return lowestPriceProduct;
    }
    return null;
  }
  
}
