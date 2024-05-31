import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SingleproductComponent } from './singleproduct/singleproduct.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartComponent } from './cart/cart.component';
import { CheckoutpageComponent } from './checkoutpage/checkoutpage.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'listing/:category', component: ListingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkoutpage', component: CheckoutpageComponent },
  // { path: '**', redirectTo: '/login' },  
  { path: 'singleproduct/:singleproductId',component: SingleproductComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes),BrowserAnimationsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
