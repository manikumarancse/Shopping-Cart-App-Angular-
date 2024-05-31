import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ListingComponent } from './listing/listing.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SingleproductComponent } from './singleproduct/singleproduct.component';
import { RatingsComponent } from './ratings/ratings.component';
import { CartComponent } from './cart/cart.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutpageComponent } from './checkoutpage/checkoutpage.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    FooterComponent,
    LandingPageComponent,
    ListingComponent,
    RatingsComponent,
    LoginComponent,
    SignupComponent,
    SingleproductComponent,
    CartComponent,
    CheckoutpageComponent,
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule // Add ReactiveFormsModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
