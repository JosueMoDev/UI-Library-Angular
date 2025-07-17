import { CommonModule } from '@angular/common';
import { Component, HostBinding, input } from '@angular/core';
import { IAuthor } from '@pages/books/interfaces/author.interface';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'book-layout',
  imports: [CommonModule, Tag],
  templateUrl: './book-layout.html',
  styleUrl: './book-layout.css',
})
export class BookLayout {
  book = input<any>(undefined);
  isListLayout = input<boolean>(false);
  @HostBinding('class')
  get hostClass() {
    return this.isListLayout()
      ? 'flex flex-col sm:flex-row sm:items-center p-6 gap-4 cursor-pointer hover:shadow-md hover:opacity-80 transition-all duration-200 rounded'
      : 'col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2 cursor-pointer hover:shadow-md hover:opacity-80 transition-all duration-200 rounded';
  }
  getSeverity(book: any) {
    return book.physicalEnable ? 'success' : undefined;
  }

  showBook(book: any) {
    console.log('Selected book:', book);
  }

  getAuthors() {
    return this.book()
      .authors.map((author: IAuthor) => author.name)
      .join(', ');
  }
}
