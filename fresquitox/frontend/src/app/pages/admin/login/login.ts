import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export default class AdminLogin {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { username, password } = this.form.getRawValue();

    if (this.auth.login(username, password)) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const target =
        returnUrl?.startsWith('/admin') && returnUrl !== '/admin/login'
          ? returnUrl
          : '/admin/dashboard';
      void this.router.navigateByUrl(target);
      return;
    }

    this.errorMessage.set('Usuario o contraseña incorrectos.');
    this.isSubmitting.set(false);
  }
}
