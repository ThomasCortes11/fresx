import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT_INFO } from '../../../shared/constants/contact-info';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  readonly contact = CONTACT_INFO;
  currentYear = new Date().getFullYear();
}
