import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { ProgressBar } from 'primeng/progressbar';
import { Badge } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { Steps } from 'primeng/steps';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload } from 'primeng/fileupload';
import { PrimeNG } from 'primeng/config';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { AuthorsService } from '@pages/authors/authors.service';
import { GenresService } from '@pages/books/services/genres.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { GenreModal } from '../genre-modal/genre-modal';
@Component({
  selector: 'book-modal',
  templateUrl: './book-modal.html',
  styleUrl: './book-modal.css',
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    InputText,
    ToggleSwitch,
    Button,
    Toast,
    ProgressBar,
    Badge,
    Steps,
    FileUpload,
    Card,
    ConfirmDialog,
    IconFieldModule,
    TableModule,
    InputIcon,
    MultiSelectModule,
  ],
})
export class BookModal {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  modalController: DialogService = inject(DialogService);
  private modelGenrRef!: DynamicDialogRef;
  private configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);
  private config: PrimeNG = inject(PrimeNG);
  private messageService: MessageService = inject(MessageService);
  private confirmController: ConfirmationService = inject(ConfirmationService);
  private authorService: AuthorsService = inject(AuthorsService);
  private genresService: GenresService = inject(GenresService);

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  files!: File[];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  book: any | undefined;
  authors: any[] = [];
  genres: any[] = [];
  selectedAuthors: any[] = [];
  selectedGenres: any[] = [];

  form = this.fb.group({
    title: ['EL ALQUIMISTA', Validators.required],
    price: [20, Validators.required],
    description: ['', Validators.required],
    genres: [[], Validators.required],
    authors: [[], Validators.required],
    physicalEnable: [false],
  });

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.book = this.configDialog.data;
    this.authors = this.authorService.authors;
    this.genres = this.genresService.genres;
    if (this.book) {
      this.form.patchValue(this.book);
      this.uploadedFiles.push({
        name: this.book.title,
        objectURL: this.book.image,
      });
      this.selectedAuthors = this.book?.authors ?? [];
      this.uploadedFiles = this.uploadedFiles;
    }

    this.steps = [
      {
        label: 'Information',
        icon: 'pi pi-info',
      },
      {
        label: 'Pick Author',
        icon: 'pi pi-person',
      },
      {
        label: 'Book Cover',
        icon: 'pi pi-file',
      },
    ];
  }

  submit() {
    console.log(this.form.value);
  }
  choose(event: Event, callback: CallableFunction) {
    callback();
  }

  onRemoveTemplatingFile(
    event: Event,
    file: File,
    removeFileCallback: CallableFunction,
    index: number
  ) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: CallableFunction) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000,
    });
  }

  onSelectedFiles(event: { currentFiles: File[] }) {
    this.files = event.currentFiles ?? [];
    this.files.forEach((file: File) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: CallableFunction) {
    callback();
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes: string[] | undefined =
      this.config.translation.fileSizeTypes ?? [];
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
  closeDialog(event: Event) {
    if (this.form.touched) {
      return this.confirmController.confirm({
        target: event.target as EventTarget,
        message: 'Estas seguro que deseas salir sin guardar?',
        header: 'Confirmation',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'NO',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'SI',
        },
        accept: () => this.ref.close(),
        reject: () => {},
      });
    }
    return this.ref.close();
  }
  changeStep(event: number) {
    this.steps![event].visible;
  }
  setSelectedAuthors() {
    this.form.get('authors')?.patchValue(this.selectedAuthors as any);
  }
  onSearchAuthor(event: Event) {
    const input = event.target as HTMLInputElement;
  }
  addNewGenre() {
    this.modelGenrRef = this.modalController.open(GenreModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      closable: true,
    });

    this.modelGenrRef.onClose.subscribe((result) => {
      if (!result) this.modelGenrRef.destroy();
    });
  }

  editGenre(genre: any, event: Event) {
    event.stopPropagation();
    this.modelGenrRef = this.modalController.open(GenreModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      closable: true,
      data: genre,
    });

    this.modelGenrRef.onClose.subscribe((result) => {
      if (!result) this.modelGenrRef.destroy();
      console.log(result);
    });
  }
}
