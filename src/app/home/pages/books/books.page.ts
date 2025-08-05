import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { BooksService } from '@home/services/books.service';
import { Book } from '@home/models';
import { BookForm } from '@home/components/book-form/book-form';
import { SkeletonBook } from '@home/components/skeleton-book/skeleton-book';
import { BookList } from '@home/components/book-list/book-list';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'books-list',
  template: `<div
      class="sticky top-0 w-full z-10 flex justify-between gap-2 p-4"
    >
      <p-selectbutton [allowEmpty]="false"> </p-selectbutton>
      <button
        pButton
        icon="pi pi-plus"
        label="Agregar"
        (click)="handleDialogBook(undefined, 0, false, $event)"
        [loading]="allBooksQuery.isLoading()"
        [disabled]="allBooksQuery.isPending()"
      ></button>
    </div>
    <div class="card flex flex-col h-full overflow-hidden">
      <div class="flex-1 overflow-y-auto px-4 py-2">
        @for (book of allBooksQuery.data(); track $index) {
        <book-list [book]="book" />
        } @empty { @if (!allBooksQuery.isLoading() &&
        !allBooksQuery.data()?.length) {
        <h1>No hay Libros que mostrar!</h1>
        } @else { @for (i of counterArray(8); track $index) {
        <book-skeleton />
        } } }
      </div>
    </div>

    <div class="sticky bottom-0 w-full z-10 bg-auto">
      <p-paginator
        [rows]="rows"
        [totalRecords]="allBooksQuery.data()?.length"
        [first]="first"
        (onPageChange)="onPageChange($event)"
        [rowsPerPageOptions]="[5, 10, 20]"
      ></p-paginator>
    </div> `,
  imports: [
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    SkeletonBook,
    BookList,
    Paginator,
  ],
  providers: [BooksService],
})
export default class BooksPage {
  #booksService = inject(BooksService);
  private dialogController: DialogService = inject(DialogService);
  rows = 5;
  first = 0;
  totalRecords = 0;

  allBooksQuery = injectQuery(() => ({
    queryKey: ['books'],
    queryFn: () => this.#booksService.allBooks(),
    refetchOnMount: true,
  }));

  onPageChange(event: any) {
    this.rows = event.rows;
    this.first = event.first;
    this.totalRecords = this.allBooksQuery.data()?.length ?? 0;
  }

  counterArray(n: number): any[] {
    return Array(n);
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
}
