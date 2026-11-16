
import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);

  showPassword = false;
  submitted = false;
  loading = false;
  errorMessage = '';
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onLogin(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;
    this.loading = true;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful:', response);
        alert('Login successful! Welcome to ShopSmart AI.');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
