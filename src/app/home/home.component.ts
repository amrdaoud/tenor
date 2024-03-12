import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatCardModule],
  templateUrl: './home.component.html',
  // styleUrl: './home.component.scss'
})
export class HomeComponent {

}
