import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';
import { Product } from '../shared/constant/data.model';
import {trigger, transition, query, style, stagger, animate } from '@angular/animations';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'], 
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        query('.card', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(50, [
            animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }) // Ensure the animation is optional to avoid errors
      ]),
      // Animation start and done callbacks
      transition('* => *', [
        animate('100ms', style({ opacity: 0 })),
        // Animation start callback
        query('.card', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(50, [
            animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }), // Ensure the animation is optional to avoid errors
      ]),
    ])
  ]
})
export class ListingComponent implements OnInit, OnDestroy {

  selectedCategory: string | null = 'All';
  priceRange: string | null = 'Default';
  category: string | null = null;
  products: Product[] = [];
  categoriesList: string[] = [];
  searchValue: string = '';
  searchProductsDetails: Product[] = [];
  hamburgerClass = 'hamburger';
  filterClass = 'filters';
  firstSearch: boolean = true;
  beforeSearch: Product[] = [];
  private searchTermSubscription!: Subscription;
  private initialLoad: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sharedService: SharedService
  ) { }

  toggle() {
    this.hamburgerClass = this.hamburgerClass === 'hamburger' ? 'hamburger active' : 'hamburger';
    this.filterClass = this.filterClass === 'filters' ? 'filters active' : 'filters';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category');
      this.selectedCategory = this.category;
      if (this.category) {
        this.fetchProducts(this.category);
      }
    });

    this.getCategoriesList();
    this.searchTermSubscription = this.sharedService.currentSearchTerm.subscribe(term => {
      this.searchValue = term;
      this.search();
    });
  }

  ngOnDestroy(): void {
    if (this.searchTermSubscription) {
      this.searchTermSubscription.unsubscribe();
    }
    this.resetSearch();
  }

  resetSearch(): void {
    if (this.initialLoad) {
      this.initialLoad = false; // Reset the flag after the first call
      return;
    }
    this.searchValue = '';
    this.searchProductsDetails = [];
    this.firstSearch = true;
    this.products = [...this.beforeSearch]; // Ensure products are reset to beforeSearch state
  }

  search() {
    if (this.searchValue.trim() !== "") {
      this.searchProductsDetails = [];
      this.initialLoad = false;
      const searchTerms = this.searchValue.toLowerCase().split(" ");
      this.beforeSearch.forEach(element => {
        const titleLower = element.title.toLowerCase();
        const anyTermMatches = searchTerms.some(term => titleLower.includes(term));
        if (anyTermMatches) {
          this.searchProductsDetails.push(element);
        }
      });
      this.products = this.searchProductsDetails;
    } else if (!this.initialLoad) { // Prevent resetting during initial load
      this.products = [...this.beforeSearch];
    }
  }

  getCategoriesList(): void {
    this.httpClient.get<string[]>('https://dummyjson.com/products/category-list').subscribe((categories: string[]) => {
      this.categoriesList = categories;
    });
  }

  fetchProducts(category: string): void {
    this.priceRange = "Default";
    this.products = [];
    this.sharedService.updateSearchTerm('');
    if (category !== "All") {
      this.httpClient.get<any>(`https://dummyjson.com/products/category/${category}`).subscribe(result => {
        this.products = result.products;
        this.beforeSearch = [...this.products];
        sessionStorage.setItem('category',category);
      });
    } else {
      this.httpClient.get<any>('https://dummyjson.com/products?limit=0').subscribe(result => {
        this.products = result.products;
        this.selectedCategory = category;
        this.beforeSearch = [...this.products];
        sessionStorage.setItem('category',category);
      });
    }
  }

  onchange(value: Event) {
    const target = value.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.fetchProducts(selectedValue);
  }

  onPriceChange(value: Event) {
    const target = value.target as HTMLSelectElement;
    const selectedPrice = target.value;

    if (selectedPrice === "LowToHigh") {
      this.sortProducts('asc');
    } else if (selectedPrice === "HighToLow") {
      this.sortProducts('desc');
    }
  }

  sortProducts(order: 'asc' | 'desc') {
    this.products = [];
    if (this.selectedCategory !== "All") {
      this.httpClient.get<any>(`https://dummyjson.com/products/category/${this.selectedCategory}?sortBy=price&order=${order}`).subscribe(result => {
        this.products = result.products;
        this.beforeSearch = [...this.products];
        this.search();
      });
    } else {
      this.httpClient.get<any>(`https://dummyjson.com/products?limit=0&sortBy=price&order=${order}`).subscribe(result => {
        this.products = result.products;
        this.beforeSearch = [...this.products];
        this.search();
      });
    }
    this.search();
  }
}
