import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Drawer } from 'primeng/drawer';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Button } from 'primeng/button';

@Component({
  selector: 'book-query',
  imports: [Drawer, IconField, InputIcon, Button],
  template: `
    <div class="flex items-center p-4 shadow bg-auto z-10 sticky top-0">
      <p-iconfield class="flex w-full">
        <p-inputicon class="pi pi-search" />
        <input
          class="w-full px-8 py-2 border border-gray-300 rounded-md"
          type="text"
          pInputText
          placeholder="Search"
        />
      </p-iconfield>
      <p-button
        icon="pi pi-filter"
        aria-label="Filtros"
        class="ml-4"
        (click)="openDrawer()"
      />
    </div>

    <p-drawer
      [(visible)]="drawerVisible"
      position="right"
      [modal]="true"
      header="Filtros"
    >
    </p-drawer>
  `,
  styleUrl: './book-query.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookQuery {
  drawerVisible: boolean = false;
  query: string | undefined;
  openDrawer() {
    this.drawerVisible = true;
  }

  onSearch(query: string) {
    console.log('Buscando:', query);
  }

  aplicarFiltros() {
    this.drawerVisible = false;
  }
}
