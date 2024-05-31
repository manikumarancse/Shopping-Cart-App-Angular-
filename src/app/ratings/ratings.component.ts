import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {

  public singleproductId: string | null = '';
  showrevpop: boolean = false;
  public getJsonData: any;
  public selectedStars: number = 0;
  reviewDescription: string = '';
  public reviews: any[] = [];
  public username: string  = '';
  public email: string | null = '';
  public individual_review: any = {}; // Changed to any
  public existingReviews: any[] | null = null; // Initialize as null
  public productReviews: any[] = [];
  public currentDate : Date = new Date(); // Get current date and time
  public formattedDate :string = this.currentDate.toISOString();

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.singleproductId = params.get('singleproductId');
      if (this.singleproductId) {
        this.getMethod(this.singleproductId);
        this.loadReviews(this.singleproductId);
      }
    });

  }

  public drawStarsRate(ratings: number): string[] {
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < ratings ? 'fa-solid fa-star active' : ' ');
    }
    return stars;
  }
  public drawStars(ratings: number): string[] {
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < ratings-1 ? 'fa-solid fa-star active' : 'fa-solid fa-star');
    }
    return stars;
  }

  getRatingInfo(selectedStars: number): { description: string, className: string } {
    switch (selectedStars) {
      case 1:
        return { description: "Worst", className: "worst-rating" };
      case 2:
        return { description: "Bad", className: "bad-rating" };
      case 3:
        return { description: "Average", className: "best-rating" };
      case 4:
        return { description: "Good", className: "best-rating" };
      case 5:
        return { description: "Best Product", className: "best-rating" };
      default:
        return { description: "", className: "" };
    }
  }

  public getMethod(singleproductId: string) {
    this.http.get(`https://dummyjson.com/products/${singleproductId}`).subscribe((data: any) => {
      console.log(data);
      this.getJsonData = data;
      if (data && Array.isArray(data.reviews)) {
        this.reviews = data.reviews;
      }
    });
  }

  rateProduct(starIndex: number) {
    this.selectedStars = starIndex + 1;
  }

  clearPopup() {
    this.selectedStars = 0;
    this.reviewDescription = '';
  }

  showpopup() {
    this.showrevpop = true;
  }

  showoffpopup() {
    this.showrevpop = false;
    this.clearPopup();
  }

  loadReviews(productId: string | null) {
    if (productId) {
      const reviewsJson = localStorage.getItem(`productReviews_${productId}`);
      this.productReviews = reviewsJson ? JSON.parse(reviewsJson) : [];
    }
  }

  popsubmitrev() {
    
    this.username =  `${sessionStorage.getItem("firstName")} ${sessionStorage.getItem("lastName")}`;
    this.email = sessionStorage.getItem("email");


    if(!this.selectedStars || !this.reviewDescription){
      alert('Please leave your comment');
      return ;
    }
    if (this.username == 'null null' || this.username.trim() === '') {
      alert("Please log in to leave a review.");
      return;
    }
    else{
      console.log(this.username);
      
      this.individual_review = {  
        username: this.username,
        rating: this.selectedStars,
        description: this.reviewDescription,
        email: this.email,
        date :this.formattedDate
      };

      const existingReviewsJson = localStorage.getItem(`productReviews_${this.singleproductId}`);
      this.existingReviews = existingReviewsJson ? JSON.parse(existingReviewsJson) : [];
      if (this.existingReviews !== null) {
        this.existingReviews.push(this.individual_review);
      } else {
        this.existingReviews = [this.individual_review]; // Initialize if null
      }

      localStorage.setItem(`productReviews_${this.singleproductId}`, JSON.stringify(this.existingReviews));

      this.loadReviews(this.singleproductId);
      this.clearPopup();
      this.showrevpop = false;
    } 
   
  }
}

