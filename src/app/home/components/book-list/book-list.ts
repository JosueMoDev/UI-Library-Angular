import { CommonModule } from '@angular/common';
import { Component, input, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { Author, Book } from '@home/models';
import { BookOptionsPopover } from '../book-options-popover/book-options-popover';
@Component({
  selector: 'book-list',
  imports: [CommonModule, Button, Popover, BookOptionsPopover],
  template: `<div
      class="group overflow-hidden transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:shadow-[rgba(0, 0, 0, 0.15)] bg-[var(--gradient-card)] border-0 my-4 px-4 rounded-xl"
    >
      <div class="flex flex-col md:flex-row relative">
        <div
          class="relative w-full md:w-48 h-80 md:h-72 flex-shrink-0 overflow-hidden group-hover:opacity-90 group-hover:shadow-lg group-hover:shadow-[rgba(0, 0, 0, 0.15)]"
        >
          <img
            [src]="book().cover_url"
            [alt]="book().title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
          />
          @if(book().total_sales === 0){
          <div
            class="absolute top-2 left-[-30px] rotate-[-45deg] bg-green-400 text-black font-bold text-[12px] tracking-wider px-0 py-[2px] shadow-md w-[100px] text-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            new
          </div>
          }
        </div>

        <div class="flex-1 p-4 space-y-3">
          <div
            class="flex flex-col lg:flex-row lg:justify-between gap-4 h-full"
          >
            <div class="flex-1 flex flex-col space-y-3">
              <h3
                class="font-bold text-3xl leading-tight text-foreground text-primary"
              >
                {{ book().title }}
              </h3>

              <div class="text-sm text-foreground font-medium">
                <span class="text-muted-foreground">Escrito por: </span>
                <span class="text-foreground text-base px-2 font-semibold">
                  {{ getAuthors() }}
                </span>
              </div>

              <p
                class="text-base text-muted-foreground line-clamp-5 max-w-10/12"
              >
                {{ book().description }}
              </p>

              <div class="mt-auto space-y-1">
                <p class="text-base text-muted-foreground font-semibold">
                  Categories
                </p>
                <div class="flex flex-wrap gap-2">
                  @for ( genre of book().genres; track $index) {
                  <span
                    class="bg-[#3b3b3b] text-white px-3 py-1 text-base font-medium rounded-full"
                  >
                    {{ genre.name }}
                  </span>
                  }
                </div>
              </div>
            </div>

            <div
              class="flex flex-col justify-between items-end space-y-3 min-w-fit h-full"
            >
              <div class="flex flex-wrap gap-2 justify-end items-center">
                @if(book().physical_enable){
                <span
                  class="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <i class="pi pi-box text-primary"></i>
                  Stock: {{ book().stock }}
                </span>
                }

                <span
                  class="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <i class="pi pi-money-bill text-green-500"></i>
                  Sales: {{ book().total_sales }}
                </span>

                <span
                  class="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <i class="pi pi-star-fill text-yellow-500"></i>
                  Vows: {{ book().stars }}
                </span>

                <p-button
                  icon="pi pi-ellipsis-v"
                  [rounded]="true"
                  severity="secondary"
                  (click)="toggle($event)"
                ></p-button>
              </div>

              <div class="flex items-end gap-4 mt-auto">
                <div class="text-2xl font-bold text-primary">
                  {{ book().price | currency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p-popover #op [dismissable]="true" appendTo="body" position="bottom">
      <book-options-popover [book]="book()" />
    </p-popover>`,
})
export class BookList {
  @ViewChild('op') op!: Popover;
  book = input.required<Book>();
  getAuthors() {
    return this.book()
      .authors.map((author: Author) => `${author.name} ${author.lastname}`)
      .join(', ');
  }
  toggle(event: Event) {
    this.op.toggle(event);
  }
}
