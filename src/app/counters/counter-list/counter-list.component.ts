import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Unsubscriber } from 'techteec-lib/common';
import {InputComponent, SelectComponent} from 'techteec-lib/controls';

@Component({
  selector: 'app-counter-list',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, SelectComponent],
  templateUrl: './counter-list.component.html',
  styleUrl: './counter-list.component.scss'
})
export class CounterListComponent extends Unsubscriber {
 frm = new FormGroup({
  text: new FormControl('', Validators.required),
  select: new FormControl('', Validators.required)
 });
 data = [
  {Name: 'a', Value: 1},
  {Name: 'b', Value: 2},
  {Name: 'c', Value: 3},
  {Name: 'd', Value: 4},
  {Name: 'e', Value: 5}
 ]
}
