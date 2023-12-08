import { Component } from '@angular/core';
import { Unsubscriber } from 'techteec-lib/common';

@Component({
  selector: 'app-counter-list',
  standalone: true,
  imports: [],
  templateUrl: './counter-list.component.html',
  styleUrl: './counter-list.component.scss'
})
export class CounterListComponent extends Unsubscriber {

}
