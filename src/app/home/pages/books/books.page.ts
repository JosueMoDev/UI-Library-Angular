import { Component, inject } from '@angular/core';
import { DataView } from 'primeng/dataview';
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

@Component({
  selector: 'books-list',
  templateUrl: './books-page.html',
  styleUrls: ['./books.page.css'],
  imports: [
    DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    SkeletonBook,
    BookList,
  ],
  providers: [BooksService],
})
export default class BooksPage {
  #booksService = inject(BooksService);
  private dialogController: DialogService = inject(DialogService);
  rows = 20;
  first = 0;
  totalRecords = 0;

  allBooksQuery = injectQuery(() => ({
    queryKey: ['books'],
    queryFn: () => this.#booksService.allBooks(),
    refetchOnMount: true,
  }));

  onPageChange(event: any) {
    this.first = event.first;
  }

  getSeverity(book: any) {
    switch (book.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return null;
    }
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
