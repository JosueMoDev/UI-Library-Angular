import { Component, computed, effect, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AppService } from '../../../app.service';

@Component({
  selector: 'menubar-component',
  standalone: true,
  imports: [Menubar],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent {
  private readonly appService = inject(AppService);
  readonly items = signal<MenuItem[]>([]);

  constructor() {
    effect(() => {
      this.items.set([
        ...(!this.appService.drawerState
          ? [
              {
                icon: 'pi pi-menu',
                command: () => this.appService.setDrawerState(true),
              },
            ]
          : []),
        {
          label: 'Home',
          icon: 'pi pi-book',
        },
        {
          label: 'Authors',
          icon: 'pi pi-user',
        },
      ]);
    });
  }
}
