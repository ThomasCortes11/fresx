import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[lazyLoadBg]',
  standalone: true
})
export class LazyLoadBgDirective implements OnInit {
  @Input() lazyLoadBg = '';
  
  private readonly el = inject(ElementRef);

  ngOnInit(): void {
    if (!this.lazyLoadBg) return;

    if ('IntersectionObserver' in globalThis) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadBackgroundImage();
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px'
        }
      );
      observer.observe(this.el.nativeElement);
    } else {
      // Fallback para navegadores antiguos
      this.loadBackgroundImage();
    }
  }

  private loadBackgroundImage(): void {
    const element = this.el.nativeElement as HTMLElement;
    element.style.backgroundImage = this.lazyLoadBg;
  }
}
