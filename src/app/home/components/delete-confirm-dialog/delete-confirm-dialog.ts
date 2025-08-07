import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { BooksService } from '@home/services';
import { Author, Book, Genre } from '@home/models';

@Component({
  selector: 'delete-confirm-dialog',
  imports: [Button],
  template: `
    <div class="flex items-center gap-3">
      <i class="pi pi-exclamation-triangle !text-3xl"></i>
      <span>¿Estás seguro que deseas eliminar este libro?</span>
    </div>

    <div class="flex justify-end items-center gap-2 mt-6">
      <p-button
        label="Cancel"
        severity="secondary"
        (click)="reject()"
      ></p-button>
      <p-button
        label="Si, eliminar"
        severity="danger"
        [loading]="deleteMutation.isPending()"
        (onClick)="handleDelete()"
      ></p-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmDialog {
  #ref: DynamicDialogRef = inject(DynamicDialogRef);
  private msgService: MessageService = inject(MessageService);
  bookService = inject(BooksService);
  #configDialog: DynamicDialogConfig<{
    item: Book | Author | Genre;
  }> = inject(DynamicDialogConfig);
  private queryClient = inject(QueryClient);
  id: string = this.#configDialog.data?.item.id!;

  async handleDelete() {
    await this.deleteMutation.mutateAsync();
    this.#ref.destroy();
  }

  reject() {
    this.#ref.destroy();
  }

  deleteMutation = injectMutation(() => ({
    mutationFn: async () => await this.bookService.deleteBook(this.id),
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
}
