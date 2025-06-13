import { Component, ViewChild, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
import { AppService } from '../../../app.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'sidebar-componet',
  imports: [
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;
  private readonly appService: AppService = inject(AppService);

  closeCallback(e: Event): void {
    this.appService.setDrawerState(false);
    this.drawerRef.close(e);
  }
  get drawerState(): boolean {
    return this.appService.drawerState;
  }
}
