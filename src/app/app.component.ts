import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { MenubarComponent } from '@shared/components/menubar/menubar.component';
import { AppService } from '@services/app.service';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationService } from './authentication/authentication.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    CommonModule,
    ToastModule,
    ConfirmDialog,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DialogService, MessageService, ConfirmationService],
})
export class AppComponent {
  auth = inject(AuthenticationService);
  msgService = inject(MessageService);

  private readonly appService: AppService = inject(AppService);
  async ngOnInit() {
    await this.auth.signInWithCredentials();
    console.log(this.auth.getBearerToken());
  }
  get drawerState(): boolean {
    return this.appService.drawerState;
  }
  onConfirmDialogHide(ref: any) {
    ref.close();
  }
}
