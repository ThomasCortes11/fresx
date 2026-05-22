import { Component, inject, signal, afterNextRender } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { ChatWidget } from './shared/components/chat-widget/chat-widget';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ChatWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  readonly hidePublicLayout = signal(this.isAdminRoute(this.router.url));
  /** Empieza en false tanto en server como en client → sin mismatch de hidratación.
   *  Se vuelve true solo después de que la hidratación completa (afterNextRender). */
  readonly isBrowser = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isBrowser.set(true);
    });

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
