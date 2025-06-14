import { Component, inject, signal, OnInit, input } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BooksService } from '@pages/books/books.service';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { SkeletonBookComponent } from '@pages/books/components/skeleton-book/skeleton-book';
import { BookLayout } from '@pages/books/components/book-layout/book-layout';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookModal } from '../components/book-modal/book-modal';
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
    SkeletonBookComponent,
  ],
  providers: [BooksService],
})
export default class BookList implements OnInit {
  layout: any = 'grid';
  books = signal<any>([]);
  options = ['list', 'grid'];

  booksService = inject(BooksService);
  modalController: DialogService = inject(DialogService);
  private ref!: DynamicDialogRef;

  rows = 6;
  first = 0;
  totalRecords = 0;

  ngOnInit() {
    const booksArray = this.booksService.Books;
    setInterval(() => {
      this.books.set(booksArray);
      this.totalRecords = booksArray.length;
    }, 7000);
  }

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
  addBook() {
    this.ref = this.modalController.open(BookModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
    });

    this.ref.onClose.subscribe((result) => {
      if (!result) this.ref.destroy();
    });
  }

  editBook(book: any) {
    this.ref = this.modalController.open(BookModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: book,
    });
    this.ref.onClose.subscribe((result) => {
      if (!result) this.ref.destroy();
      if (result) {
        console.log('Resultado del modal:', result);
      }
    });
  }
}
