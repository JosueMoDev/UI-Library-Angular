import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthorsService } from '../authors.service';
import { AuthorModal } from '@pages/authors/components/author-modal/author-modal';
import { DataView } from 'primeng/dataview';
import { Skeleton } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-authors-list',
  imports: [DataView, Skeleton, CommonModule, ButtonModule],
  templateUrl: './authors-list.html',
  styleUrl: './authors-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthorsList {
  layout: any = 'grid';
  authors = signal<any>([]);
  options = ['list', 'grid'];

  authorService = inject(AuthorsService);
  modalController: DialogService = inject(DialogService);
  private ref!: DynamicDialogRef;

  rows = 6;
  first = 0;
  totalRecords = 0;

  ngOnInit() {
    const authorsArray = this.authorService.authors;
    setInterval(() => {
      this.authors.set(authorsArray);
      this.totalRecords = authorsArray.length;
    }, 300);
  }

  onPageChange(event: any) {
    this.first = event.first;
  }

  counterArray(n: number): any[] {
    return Array(n);
  }

  addAuthor() {
    this.ref = this.modalController.open(AuthorModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
    });

    this.ref.onClose.subscribe((result) => {
      if (!result) this.ref.destroy();
    });
  }

  editAuthor(author: any) {
    this.ref = this.modalController.open(AuthorModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: author,
    });
    this.ref.onClose.subscribe((result) => {
      if (!result) this.ref.destroy();
      if (result) {
        console.log('Resultado del modal:', result);
      }
    });
  }
}
