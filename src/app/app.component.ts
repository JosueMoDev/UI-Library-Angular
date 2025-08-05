import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { AppService } from '@services/app.service';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationService } from '../services/authentication.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    CommonModule,
    ToastModule,
    ConfirmDialog,
  ],
  template: `
    @if(this.auth.getBearerToken()){
    <sidebar-componet />
    <div
      class="transition-all duration-300"
      [ngClass]="{ 'ml-80': drawerState, 'ml-0': !drawerState }"
    >
      <p-toast position="top-right"></p-toast>
      <p-confirmdialog />

      <router-outlet />
    </div>
    }
  `,
  providers: [DialogService, MessageService, ConfirmationService],
})
export class AppComponent {
  title: string = 'UI-Library-Angular';
  auth = inject(AuthenticationService);
  msgService = inject(MessageService);

  private readonly appService: AppService = inject(AppService);
  async ngOnInit() {
    await this.auth.signInWithCredentials();
  }
  get drawerState(): boolean {
    return this.appService.drawerState;
  }
  onConfirmDialogHide(ref: any) {
    ref.close();
  }
}
