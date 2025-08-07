import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { BooksService } from '@home/services';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthenticationService } from '../../../../services/authentication.service';
import { Book } from '@home/models';
import { BookForm } from '../book-form/book-form';
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog';
import { UpdateBookDto } from '@home/dtos';

@Component({
  selector: 'book-options-popover',
  imports: [],
  template: `<div class="flex flex-col gap-2 min-w-[180px] mr-0">
    <button
      type="button"
      class="flex items-center w-full px-3 py-2 text-sm text-left text-gray-100 hover:bg-gray-800 transition rounded-sm hover:opacity-95 cursor-pointer"
    >
      <i class="pi pi-upload mr-2 text-gray-100"></i>
      Compartir
    </button>

    <button
      type="button"
      class="flex items-center w-full px-3 py-2 text-sm text-left text-gray-100 hover:bg-gray-800 transition rounded-sm hover:opacity-95 cursor-pointer"
      (click)="handleDialogBook(book(), 0, true, $event)"
    >
      <i class="pi pi-pencil mr-2 text-gray-100"></i>
      Editar
    </button>

    <button
      type="button"
      class="flex items-center w-full px-3 py-2 text-sm text-left text-gray-100 hover:bg-gray-800 transition rounded-sm hover:opacity-95 cursor-pointer"
      (click)="toggleStatus()"
    >
      <i class="{{ getIcon() }} mr-2 text-gray-100"></i>
      {{ book().is_enable ? 'Inhabilitar' : 'Habilitar' }}
    </button>

    <button
      type="button"
      class="flex items-center w-full px-3 py-2 text-sm text-left text-gray-100 hover:bg-gray-800 transition rounded-sm hover:opacity-95 cursor-pointer"
    >
      <i class="pi pi-tag mr-2 text-gray-100"></i>
      Aplicar Promo
    </button>

    <button
      type="button"
      class="flex items-center w-full px-3 py-2 text-sm text-left text-gray-100 hover:bg-gray-800 transition rounded-sm hover:opacity-95 cursor-pointer"
      (click)="handleDialogBook(book(), 1, true, $event)"
    >
      <i class="pi pi-cloud-upload mr-2 text-gray-100"></i>
      Subir Imágenes
    </button>

    <button
      type="button"
      class="flex items-center w-full px-3 py-2 text-sm text-left text-white bg-red-600 hover:bg-red-500 rounded-sm transition hover:opacity-95 cursor-pointer"
      (click)="confirmDelete($event, book())"
    >
      <i class="pi pi-trash mr-2 text-gray-100"></i>
      Eliminar
    </button>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookOptionsPopover {
  #dialogController = inject(DialogService);
  #ref = inject(DynamicDialogRef);
  #bookService = inject(BooksService);
  #msgService = inject(MessageService);
  #queryClient = inject(QueryClient);
  readonly #auth = inject(AuthenticationService);
  book = input.required<Book>();

  handleDialogBook(book: Book, step: number, isEditing: boolean, event: Event) {
    event.stopPropagation();
    this.#dialogController.open(BookForm, {
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

  confirmDelete(event: Event, item: Book) {
    event.stopPropagation();
    this.#ref = this.#dialogController.open(DeleteConfirmDialog, {
      width: 'auto',
      height: 'auto',
      header: 'Confirmación',
      dismissableMask: false,
      modal: true,
      data: {
        item,
      },
    });
    this.#ref.onClose.subscribe((result) => {
      if (!result) this.#ref.destroy();
    });
  }

  statusMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateBookDto) =>
      await this.#bookService.changeBookStatus(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was updated successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.#msgService.add({
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

  toggleStatus() {
    this.statusMutation.mutateAsync({
      id: this.book().id,
      is_enable: this.book().is_enable,
      updated_by: this.#auth.getAuthenticatedUser()!,
    });
  }
}
