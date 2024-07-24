import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './../../../../assets/css/styles.css',
    './../../../../assets/css/app.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {}
