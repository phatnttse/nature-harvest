import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-view-cart',
  standalone: true,
  templateUrl: './view-cart.component.html',
  styleUrl: './view-cart.component.scss',
  imports: [HeaderComponent, FooterComponent],
})
export class ViewCartComponent {}
