import { Component } from '@angular/core';
import  {IconSideNavComponent} from 'techteec-lib/components/icon-side-nav';
import { items } from './side-nav.const';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [IconSideNavComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  items = items;
}
