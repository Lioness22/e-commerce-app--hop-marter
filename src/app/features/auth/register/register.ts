
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  showPassword = false;
  loading = false;
  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const userData = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.http.post(
      'https://e-commerce-app-hop-marter-3.onrender.com/api/api/users/register',
      userData
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.success('Registration successful! Welcome to ShopSmart AI.');
        console.log('Registration response:', response);
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        this.toastService.error(
          error.error?.message || 'Registration failed. Please try again.'
        );
      }
    });
  }
}
