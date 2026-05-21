import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  readonly hidePublicLayout = signal(this.isAdminRoute(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.hidePublicLayout.set(this.isAdminRoute(url));
      });
  }

  private isAdminRoute(url: string): boolean {
    return url.startsWith('/admin');
  }
}
