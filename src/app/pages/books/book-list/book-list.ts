import { Component, inject, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { CommonModule } from '@angular/common';
import { BooksService } from '@pages/books/services/books.service';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { BookLayout } from '@pages/books/components/book-layout/book-layout';
import { SkeletonBook } from '@pages/books/components/skeleton-book/skeleton-book';
import { ButtonModule } from 'primeng/button';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Book } from '../models';
import { BookForm } from '../components/book-form/book-form';

@Component({
  selector: 'books-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css'],
  imports: [
    DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    BookLayout,
    SkeletonBook,
  ],
  providers: [BooksService],
})
export default class BookList implements OnInit {
  private booksService = inject(BooksService);
  private dialogController: DialogService = inject(DialogService);
  rows = 20;
  first = 0;
  totalRecords = 0;

  allBooks = injectQuery(() => ({
    queryKey: ['books'],
    queryFn: () => this.booksService.allBooks(),
    refetchOnMount: true,
  }));

  async ngOnInit() {}

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
