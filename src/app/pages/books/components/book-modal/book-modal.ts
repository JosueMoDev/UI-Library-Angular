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
import { AuthorsService } from '@pages/books/services/authors.service';
import { GenresService } from '@pages/books/services/genres.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { GenreModal } from '../genre-modal/genre-modal';
import { AuthorModal } from '../author-modal/author-modal';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { IGenre } from '@pages/books/interfaces/genre.interface';
import {
  CreateBookDto,
  CreateBookSchema,
} from '@pages/books/dtos/create-book-dto';
import { BooksService } from '@pages/books/services/books.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { IAuthor } from '@pages/books/interfaces/author.interface';

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
    MultiSelectModule,
  ],
})
export class BookModal {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  modalController: DialogService = inject(DialogService);
  private modalGenrRef!: DynamicDialogRef;
  private modalAuthorRef!: DynamicDialogRef;

  private configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);
  private config: PrimeNG = inject(PrimeNG);
  private msgService: MessageService = inject(MessageService);
  private confirmController: ConfirmationService = inject(ConfirmationService);
  private authorService: AuthorsService = inject(AuthorsService);
  private genresService: GenresService = inject(GenresService);
  private bookService: BooksService = inject(BooksService);
  private queryClient = inject(QueryClient);
  private readonly auth = inject(AuthenticationService);

  allGenres = injectQuery(() => ({
    queryKey: ['genres'],
    queryFn: () => this.genresService.getGenres(),
  }));

  allAuthors = injectQuery(() => ({
    queryKey: ['authors'],
    queryFn: async () =>
      (await this.authorService.getAuthors()).map((author) => ({
        ...author,
        fullName: `${author.name} ${author.lastname}`,
      })),
  }));

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  files!: File[];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  book: any | undefined;
  authors: any[] = [];
  selectedAuthors: any[] = [];
  selectedGenres: any[] = [];
  isEditing: boolean = false;

  form = this.fb.group({
    title: [<string>'', Validators.required],
    price: [<number>0, Validators.required],
    description: [<string>'', Validators.required],
    authors: [<string[]>[], Validators.required],
    genres: [<string[]>[], Validators.required],
    physical_enable: [false],
  });

  mutation = injectMutation(() => ({
    mutationFn: async (dto: CreateBookDto) =>
      await this.bookService.addBook(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was created successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al guardar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.book = this.configDialog.data;
    console.log(this.book);
    if (this.book) {
      this.form.patchValue({
        ...this.book,
        authors: this.book?.authors.map(({ id }: IAuthor) => id),
        genres: this.book.genres.map(({ id }: IGenre) => id),
      });
      this.uploadedFiles.push({
        name: this.book.title,
        objectURL: this.book.image,
      });
      this.uploadedFiles = this.uploadedFiles;
    }

    this.steps = [
      {
        label: 'Information',
        icon: 'pi pi-info',
      },
      {
        label: 'Book Cover',
        icon: 'pi pi-file',
      },
    ];
  }

  async submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      const result = CreateBookSchema.safeParse({
        ...this.form.value,
        created_by: this.auth.getAuthenticatedUser(),
      } as CreateBookDto);
      if (!result.success) {
        result.error.errors.map((err) =>
          this.msgService.add({
            key: err.code,
            severity: 'error',
            summary: 'Error',
            detail: `Error al guardar: ${err.message}`,
            life: 3000,
          })
        );
      }
      if (this.isEditing) {
      } else {
        await this.mutation.mutateAsync(result.data!);
      }
      this.ref.close();
    }
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
    this.msgService.add({
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
    this.modalGenrRef = this.modalController.open(GenreModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      closable: true,
    });

    this.modalGenrRef.onClose.subscribe((result) => {
      if (!result) this.modalGenrRef.destroy();
    });
  }

  editGenre(genre: any, event: Event) {
    event.stopPropagation();
    this.modalGenrRef = this.modalController.open(GenreModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      closable: true,
      data: genre,
    });

    this.modalGenrRef.onClose.subscribe((result) => {
      if (!result) this.modalGenrRef.destroy();
    });
  }

  addAuthor() {
    this.modalAuthorRef = this.modalController.open(AuthorModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
    });

    this.modalAuthorRef.onClose.subscribe((result) => {
      if (!result) this.modalAuthorRef.destroy();
    });
  }

  editAuthor(author: any, event: Event) {
    event.stopPropagation();
    this.modalAuthorRef = this.modalController.open(AuthorModal, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: author,
    });
    this.modalAuthorRef.onClose.subscribe((result) => {
      if (!result) this.modalAuthorRef.destroy();
      if (result) {
        console.log('Resultado del modal:', result);
      }
    });
  }

  disableBackgroundScroll() {
    document.body.style.overflow = 'hidden';
  }

  enableBackgroundScroll() {
    document.body.style.overflow = '';
  }

  onRemoveAll(kind: 'authors' | 'genres'): void {
    if (kind === 'authors') {
      this.selectedAuthors = [];
      this.form.get('authors')?.reset();
    }
    if (kind === 'genres') {
      this.selectedGenres = [];
      this.form.get('genres')?.reset();
    }
  }
}
