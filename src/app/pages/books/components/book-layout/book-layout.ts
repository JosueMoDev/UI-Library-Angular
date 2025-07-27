import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { IAuthor } from '@pages/books/interfaces/author.interface';
import {
  ConfirmationService,
  MenuItem,
  MenuItemCommandEvent,
} from 'primeng/api';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Book } from '../../models/book.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BookModal } from '../book-modal/book-modal';

@Component({
  selector: 'book-layout',
  imports: [CommonModule, Menu, Button, OverlayPanelModule],
  templateUrl: './book-layout.html',
  styleUrl: './book-layout.css',
})
export class BookLayout {
  private ref!: DynamicDialogRef;
  modalController: DialogService = inject(DialogService);
  private confirmController: ConfirmationService = inject(ConfirmationService);
  items!: MenuItem[];
  book = input.required<Book>();

  ngOnInit(): void {
    this.items = [
      {
        label: 'Compartir',
        icon: 'pi pi-upload',
        command: () => this.onCompartir(),
      },
      {
        label: 'Edita Libro',
        icon: 'pi pi-pencil',
        command: () => this.editBook(this.book()),
      },
      {
        label: 'Enable',
        icon: 'pi pi-eye',
        command: () => this.onArchivar(),
      },
      {
        label: 'Apply Promo',
        icon: 'pi pi-tag',
        command: () => this.onArchivar(),
      },
      {
        label: 'Subir Imagenes',
        icon: 'pi pi-cloud-upload',
        command: () => {
          this.editBook(this.book(), 1);
        },
      },
      {
        separator: true,
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        styleClass: 'bg-red-700 mt-2 rounded-md',
        iconStyle: {
          color: 'white',
          opacity: 0.9,
        },

        command: ($event) => this.deleteDialog($event),
      },
    ];
  }
  onCompartir() {
    console.log('Compartir');
  }
  onRenombrar() {
    console.log('Renombrar');
  }
  onArchivar() {
    console.log('Archivar');
  }

  getAuthors() {
    return this.book()
      .authors.map((author: IAuthor) => `${author.name} ${author.lastname}`)
      .join(', ');
  }

  editBook(book: Book, step?: number) {
    this.ref = this.modalController.open(BookModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: {
        book,
        step,
      },
    });
  }

  deleteDialog(event: MenuItemCommandEvent) {
    return this.confirmController.confirm({
      target: event.originalEvent?.target as EventTarget,
      message: 'Estas seguro que deseas eliminar este libro?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',

      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Si, Eliminar',
        severity: 'danger',
      },
      accept: () => console.log('Deleting'),
    });
  }
}
