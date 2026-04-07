import { Component, Input } from '@angular/core';
import { CONTACT_INFO } from '../../constants/contact-info';

@Component({
  selector: 'app-delivery-options',
  standalone: true,
  imports: [],
  templateUrl: './delivery-options.html',
  styleUrl: './delivery-options.scss'
})
export class DeliveryOptions {
  readonly contact = CONTACT_INFO;

  /** 'full' = 3 cards inline, 'compact' = smaller horizontal strip, 'mini' = icon-only pills */
  @Input() variant: 'full' | 'compact' | 'mini' = 'full';

  /** Light text on dark bg (default) or dark text on light bg */
  @Input() theme: 'dark' | 'light' = 'dark';
}
