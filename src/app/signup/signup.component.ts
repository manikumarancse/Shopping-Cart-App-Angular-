import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  signUp(e: Event): void {
    e.preventDefault();

    // Get input values from the form
    const fnameInput = document.getElementById('fname') as HTMLInputElement;
    const lnameInput = document.getElementById('lname') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const pwdInput = document.getElementById('pwd') as HTMLInputElement;

    const fname: string = fnameInput.value.trim();
    const lname: string = lnameInput.value.trim();
    const email: string = emailInput.value.trim();
    const pwd: string = pwdInput.value.trim();

    // Validate input values
    if (!this.validateFields(fname, lname, email, pwd)) {
      return;
    }

    // Retrieve existing form data from localStorage or initialize an empty array
    let formData: Array<{ fname: string, lname: string, email: string, pwd: string, login: string }> = JSON.parse(localStorage.getItem('formData') || '[]');

    // Check if there is already an entry with the same email
    const exist: boolean = formData.some(data => data.email.toLowerCase() === email.toLowerCase());

    // If no duplicate email is found, add the new user to the form data
    if (!exist) {
      formData.push({ fname, lname, email, pwd, login: 'inactive' });
      localStorage.setItem('formData', JSON.stringify(formData));
      (document.querySelector('form') as HTMLFormElement).reset();
      fnameInput.focus();
      this.router.navigate(['/login']);
    } else {
      alert("Ooopppssss... Duplicate found!!!\nYou have already signed up");
    }
  }

  validateFields(fname: string, lname: string, email: string, pwd: string): boolean {
    if (!fname) {
      alert("First name is required");
      return false;
    }
    if (!lname) {
      alert("Last name is required");
      return false;
    }
    if (!email || !this.validateEmail(email)) {
      alert("A valid email is required");
      return false;
    }
    if (!pwd || pwd.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    return true;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

}
