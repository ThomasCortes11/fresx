import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  readonly contact = CONTACT_INFO;
}
