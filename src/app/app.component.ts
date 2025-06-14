import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { MenubarComponent } from '@shared/components/menubar/menubar.component';
import { AppService } from '@services/app.service';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, MenubarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DialogService, MessageService, ConfirmationService],
})
export class AppComponent {
  private readonly appService: AppService = inject(AppService);

  get drawerState(): boolean {
    return this.appService.drawerState;
  }
}
