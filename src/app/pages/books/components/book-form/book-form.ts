import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { Steps } from 'primeng/steps';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload } from 'primeng/fileupload';
import { PrimeNG } from 'primeng/config';
import { Card } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { AuthorsService } from '@pages/books/services/authors.service';
import { GenresService } from '@pages/books/services/genres.service';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { IGenre } from '@pages/books/interfaces/genre.interface';

import { BooksService } from '@pages/books/services/books.service';
import { AuthenticationService } from '@services/authentication.service';
import { IAuthor } from '@pages/books/interfaces/author.interface';
import {
  UpdateBookDto,
  UpdateBookSchema,
} from '@pages/books/dtos/update-book.dto';
import { Book } from '@pages/books/models/book.model';
import {
  CreateBookDto,
  CreateBookSchema,
} from '@pages/books/dtos/create-book.dto';
import { Author } from '@pages/books/models/author.model';
import { Genre } from '@pages/books/models/genre.model';
import { GenreForm } from '../genre-form/genre-form';
import { AuthorForm } from '../author-form/author-form';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    InputText,
    ToggleSwitch,
    Button,
    ProgressBar,
    Steps,
    FileUpload,
    Card,
    IconFieldModule,
    TableModule,
    MultiSelectModule,
  ],
})
export class BookForm {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private GenrDialogRef!: DynamicDialogRef;
  private AuthorDialogRef!: DynamicDialogRef;
  modalController: DialogService = inject(DialogService);

  private configDialog: DynamicDialogConfig<{
    book: Book;
    step: number | undefined;
    isEditing: boolean;
  }> = inject(DynamicDialogConfig);

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
    queryFn: async () => await this.authorService.getAuthors(),
  }));

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  file!: File | null;
  totalSize: number = 0;
  totalSizePercent: number = 0;
  book: any | undefined;
  authors: any[] = [];
  selectedAuthors: any[] = [];
  selectedGenres: any[] = [];
  isEditing!: boolean;

  form = this.fb.group({
    title: [<string>'', Validators.required],
    price: [<number>0, Validators.required],
    description: [<string>'', Validators.required],
    authors: [<string[]>[], Validators.required],
    genres: [<string[]>[], Validators.required],
    physical_enable: [false],
  });

  createMutation = injectMutation(() => ({
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

  updateMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateBookDto) =>
      await this.bookService.updateBook(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was updated successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al editar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  fileMutation = injectMutation(() => ({
    mutationFn: async ({ dto, book }: { dto: File; book: Book }) =>
      await this.bookService.uploadFile(dto, book),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'cover picture was uploaded successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error while upload cover picture: ${error.message}`,
        life: 3000,
      });
    },
  }));

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.book = this.configDialog.data?.book;
    this.isEditing = this.configDialog.data!.isEditing;
    this.step.set(this.configDialog.data?.step ?? 0);
    if (this.book && this.isEditing) {
      this.form.patchValue({
        ...this.book,
        authors: this.book?.authors.map(({ id }: IAuthor) => id),
        genres: this.book.genres.map(({ id }: IGenre) => id),
      });
      this.uploadedFiles.push({
        name: this.book.title,
        cover_url: this.book.cover_url,
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
      if (this.isEditing) {
        const result = UpdateBookSchema.safeParse({
          id: this.book.id,
          ...this.form.value,
          updated_by: this.auth.getAuthenticatedUser(),
        } as UpdateBookDto);
        if (!result.success) {
          result.error.errors.map((err) =>
            this.msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al editar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.updateMutation.mutateAsync(result.data!);
        this.ref.close();
      }
      if (!this.isEditing) {
        const result = CreateBookSchema.safeParse({
          ...this.form.value,
          created_by: this.auth.getAuthenticatedUser(),
        } as CreateBookDto);
        if (!result.success) {
          result.error.errors.map((err: any) =>
            this.msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al guardar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.createMutation.mutateAsync(result.data!);
        this.ref.close();
      }
    }
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
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Si, Cerrar',
        },
        accept: () => this.ref.close(),
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

  handleGenreForm(genre: Genre | undefined, isEditing: boolean, event: Event) {
    event.stopPropagation();
    this.GenrDialogRef = this.modalController.open(GenreForm, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      closable: true,
      modal: true,
      data: {
        genre,
        isEditing,
      },
    });
    this.GenrDialogRef.onClose.subscribe((result) => {
      if (!result) this.GenrDialogRef.destroy();
    });
  }

  handleAuthorForm(
    author: Author | undefined,
    isEditing: boolean,
    event: Event
  ) {
    event.stopPropagation();
    this.AuthorDialogRef = this.modalController.open(AuthorForm, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: {
        author,
        isEditing,
      },
    });
    this.AuthorDialogRef.onClose.subscribe((result) => {
      if (!result) this.AuthorDialogRef.destroy();
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

  choose(event: Event, callback: CallableFunction) {
    callback();
  }

  onRemoveTemplatingFile() {
    this.file = null;
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
    const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

    const originalFile = event.currentFiles[0];
    const extension = originalFile.name.split('.').pop()?.toLowerCase();

    const newFileName = `${this.book?.id}.${extension}`;

    const renamedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
    });

    this.file = renamedFile;

    this.totalSize = this.file.size;
    this.totalSizePercent = Math.min((this.totalSize / MAX_BYTES) * 100, 100);
  }

  async uploadEvent() {
    await this.fileMutation.mutateAsync({
      dto: this.file!,
      book: this.book!,
    });
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const MAX_BYTES = 3 * k * k;
    const sizes: string[] | undefined =
      this.config.translation.fileSizeTypes ?? [];

    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    if (bytes > MAX_BYTES) {
      return `> 3 ${sizes[2] ?? 'MB'}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
}
