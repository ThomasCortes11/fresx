import { Component } from '@angular/core';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';
import { DeliveryOptions } from '../../../shared/components/delivery-options/delivery-options';

@Component({
  selector: 'app-hero',
  imports: [DeliveryOptions],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  readonly contact = CONTACT_INFO;
}
