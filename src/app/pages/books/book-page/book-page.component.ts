import { Component, inject, signal, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { BooksService } from '../books.service';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'books-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css'],
  imports: [
    DataView,
    Tag,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    Skeleton,
  ],
  providers: [BooksService],
})
export default class BookPageComponent implements OnInit {
  layout: any = 'grid';
  books = signal<any>([]);
  options = ['list', 'grid'];

  booksService = inject(BooksService);

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

  onAdd() {
    console.log('Agregar nuevo elemento');
  }

  showBook(book: any) {
    console.log(book);
  }
}
