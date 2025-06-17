import { Component, HostBinding, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'book-skeleton',
  imports: [Skeleton],
  templateUrl: './skeleton-book.html',
  styleUrl: './skeleton-book.css',
})
export class SkeletonBook {
  isListLayout = input<boolean>(false);
  @HostBinding('class')
  get hostClass() {
    return this.isListLayout()
      ? 'flex flex-col xl:flex-row xl:items-start p-6 gap-6'
      : 'col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 p-2';
  }
}
