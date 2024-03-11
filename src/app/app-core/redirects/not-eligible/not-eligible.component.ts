import { Component } from '@angular/core';
import { UnauthorizedComponent } from 'techteec-lib/dialogs-and-templates';
@Component({
  selector: 'app-not-eligible',
  standalone: true,
  imports: [UnauthorizedComponent],
  templateUrl: './not-eligible.component.html',
  styleUrl: './not-eligible.component.scss'
})
export class NotEligibleComponent {

}
