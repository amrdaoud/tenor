import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, provideRouter, withHashLocation } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { StartupService } from './startup-service/startup.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public startupService = inject(StartupService);

  ngOnInit(): void {
    this.startupService.FindToken();
  }
  title = 'tenor';
}
