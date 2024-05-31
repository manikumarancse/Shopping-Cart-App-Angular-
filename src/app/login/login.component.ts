import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  signIn(e: Event): void {
    e.preventDefault();

    // Getting input values from the form
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const pwdInput = document.getElementById('pwd') as HTMLInputElement;
    const email: string = emailInput.value;
    const pwd: string = pwdInput.value;

    // Retrieve existing form data from localStorage or initialize an empty array
    let formData: Array<{ email: string, pwd: string, fname: string, lname: string, login?: string }> = JSON.parse(localStorage.getItem('formData') || '[]');

    // Check if there is a user with matching email and password
    const exist: boolean = formData.some(data => data.email.toLowerCase() === email.toLowerCase() && data.pwd.toLowerCase() === pwd.toLowerCase());
    const userIndex: number = formData.findIndex(data => data.email.toLowerCase() === email.toLowerCase() && data.pwd.toLowerCase() === pwd.toLowerCase());

    if (userIndex !== -1) {
        formData[userIndex].login = 'active';
        console.log(formData);
        localStorage.setItem('formData', JSON.stringify(formData));

        // Store session data
        sessionStorage.setItem("ID", userIndex.toString());
        sessionStorage.setItem("firstName", formData[userIndex].fname);
        sessionStorage.setItem("lastName", formData[userIndex].lname);
        sessionStorage.setItem("email", formData[userIndex].email);

        // Ensure login is a string
        sessionStorage.setItem("login", formData[userIndex].login || '');
    }
     
    // If no matching user is found, show an error message
    if (!exist) {
        alert("Incorrect login credentials");
    } else {
        // If a matching user is found, redirect to the home page
        this.router.navigate(['/']);  // Navigate to the home page (update path as needed)
    }
  }
}
