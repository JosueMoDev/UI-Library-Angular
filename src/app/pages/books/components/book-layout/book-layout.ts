import { CommonModule } from '@angular/common';
import { Component, inject, input, ViewChild } from '@angular/core';
import { IAuthor } from '@pages/books/interfaces/author.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Book } from '../../models/book.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { BookModal } from '../book-modal/book-modal';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { UpdateBookDto } from '@pages/books/dtos/update-book.dto';
import { BooksService } from '@pages/books/services/books.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'book-layout',
  imports: [CommonModule, Button, Popover],
  templateUrl: './book-layout.html',
  styleUrl: './book-layout.css',
})
export class BookLayout {
  @ViewChild('op') op!: Popover;
  private ref!: DynamicDialogRef;
  modalController: DialogService = inject(DialogService);
  bookService = inject(BooksService);
  private msgService: MessageService = inject(MessageService);
  private confirmController: ConfirmationService = inject(ConfirmationService);
  book = input.required<Book>();
  private queryClient = inject(QueryClient);
  private readonly auth = inject(AuthenticationService);
  popoverVisible = false;

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

  deleteDialog(event: Event) {
    return this.confirmController.confirm({
      target: event.target as EventTarget,
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
      accept: () => {
        this.deleteMutation.mutateAsync();
      },
    });
  }

  statusMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateBookDto) =>
      await this.bookService.changeBookStatus(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was updated successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al editar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  deleteMutation = injectMutation(() => ({
    mutationFn: async () => await this.bookService.deleteBook(this.book().id),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was successfully deleted',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al editar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  getIcon(): string {
    if (this.statusMutation.isPending()) {
      return 'pi pi-spin pi-spinner';
    }

    return this.book().is_enable ? 'pi pi-eye' : 'pi pi-eye-slash';
  }

  toggle(event: Event) {
    this.op.toggle(event);
  }

  toggleStatus() {
    this.statusMutation.mutateAsync({
      id: this.book().id,
      is_enable: this.book().is_enable,
      updated_by: this.auth.getAuthenticatedUser()!,
    });
  }
}
