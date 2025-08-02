import { CommonModule } from '@angular/common';
import { Component, inject, input, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { AuthenticationService } from '@services/authentication.service';
import { Popover } from 'primeng/popover';
import { BookForm } from '../book-form/book-form';
import { Author, Book } from '@home/models';
import { BooksService } from '@home/services/books.service';
import { UpdateBookDto } from '@home/dtos/update-book.dto';

@Component({
  selector: 'book-list',
  imports: [CommonModule, Button, Popover],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {
  @ViewChild('op') op!: Popover;
  private dialogController: DialogService = inject(DialogService);
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
      .authors.map((author: Author) => `${author.name} ${author.lastname}`)
      .join(', ');
  }

  handleDialogBook(
    book: Book | undefined,
    step: number,
    isEditing: boolean,
    event: Event
  ) {
    event.stopPropagation();
    this.dialogController.open(BookForm, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: {
        book,
        step,
        isEditing,
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
