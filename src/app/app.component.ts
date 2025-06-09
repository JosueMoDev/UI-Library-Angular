import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from './authentication/authentication.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MenubarComponent } from './shared/components/menubar/menubar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, MenubarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  drawer = false;
  toggle(): void {
    this.drawer = true;
  }
}
