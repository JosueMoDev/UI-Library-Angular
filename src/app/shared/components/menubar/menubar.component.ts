import { Component, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'menubar-component',
  imports: [Menubar],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
})
export class MenubarComponent {
  items: MenuItem[] | undefined;
  readonly drawerToggle = output<boolean>();
  ngOnInit(): void {
    this.items = [
      {
        icon: 'pi pi-menu',
        command: () => this.drawerToggle.emit(true),
      },
      {
        label: 'Home',
        icon: 'pi pi-book',
      },
      {
        label: 'Authors',
        icon: 'pi pi-user',
      },
    ];
  }
}
