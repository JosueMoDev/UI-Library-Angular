import {
  Component,
  ViewChild,
  WritableSignal,
  input,
  signal,
  effect,
} from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
@Component({
  selector: 'sidebar-componet',
  imports: [DrawerModule, ButtonModule, Ripple, AvatarModule, StyleClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;
  readonly toggleState = input<boolean>(false);
  visible: WritableSignal<boolean> = signal<boolean>(false);
  constructor() {
    effect(() => {
      if (this.toggleState) this.visible.set(this.toggleState());
    });
  }
  closeCallback(e: Event): void {
    this.toggleState;
    this.visible.set(false);
    this.drawerRef.close(e);
  }
}
