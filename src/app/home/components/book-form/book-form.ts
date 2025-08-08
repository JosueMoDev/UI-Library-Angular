import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Steps } from 'primeng/steps';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Card } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';

import { MultiSelectModule } from 'primeng/multiselect';
import { AuthenticationService } from '@services/authentication.service';
import { GenreForm } from '../genre-form/genre-form';
import { AuthorForm } from '../author-form/author-form';
import {
  CreateBookDto,
  UpdateBookDto,
  UpdateBookSchema,
  CreateBookSchema,
} from '@home/dtos';
import { IAuthor, IGenre } from '@home/interfaces';
import { Book, Genre, Author } from '@home/models';
import { AuthorsService, GenresService, BooksService } from '@home/services';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { UploadFileComponent } from '../upload-file/upload-file';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.html',
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    InputText,
    ToggleSwitch,
    Button,
    Steps,
    Card,
    IconFieldModule,
    TableModule,
    MultiSelectModule,
    UploadFileComponent,
  ],
})
export class BookForm {
  // PRIMENG
  #ref: DynamicDialogRef = inject(DynamicDialogRef);
  #genreDialogRef!: DynamicDialogRef;
  #authorDialogRef!: DynamicDialogRef;
  #modalController: DialogService = inject(DialogService);
  #configDialog: DynamicDialogConfig<{
    book: Book;
    step: number | undefined;
    isEditing: boolean;
  }> = inject(DynamicDialogConfig);
  #confirmController: ConfirmationService = inject(ConfirmationService);
  #fb = inject(FormBuilder);
  #msgService = inject(MessageService);
  #queryClient = inject(QueryClient);
  #genresService = inject(GenresService);
  #authorService = inject(AuthorsService);
  #bookService = inject(BooksService);
  readonly #auth = inject(AuthenticationService);
  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  book: any | undefined;
  authors: any[] = [];
  selectedAuthors: any[] = [];
  selectedGenres: any[] = [];
  isEditing!: boolean;

  form = this.#fb.group({
    title: [<string>'', Validators.required],
    price: [<number>0, Validators.required],
    description: [<string>'', Validators.required],
    authors: [<string[]>[], Validators.required],
    genres: [<string[]>[], Validators.required],
    physical_enable: [false],
  });

  allGenresQuery = injectQuery(() => ({
    queryKey: ['genres'],
    queryFn: () => this.#genresService.allGenres(),
  }));

  allAuthorsQuery = injectQuery(() => ({
    queryKey: ['authors'],
    queryFn: () => this.#authorService.allAuthors(),
  }));

  addBookMutation = injectMutation(() => ({
    mutationFn: async (dto: CreateBookDto) =>
      await this.#bookService.addBook(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was created successfully',
        life: 3000,
      });

      this.#queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.#msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al guardar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  updateBookMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateBookDto) =>
      await this.#bookService.updateBook(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Book was updated successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.#msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al editar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  ngOnInit(): void {
    this.book = this.#configDialog.data?.book;
    this.isEditing = this.#configDialog.data!.isEditing;
    this.step.set(this.#configDialog.data?.step ?? 0);
    if (this.book && this.isEditing) {
      this.form.patchValue({
        ...this.book,
        authors: this.book?.authors.map(({ id }: IAuthor) => id),
        genres: this.book.genres.map(({ id }: IGenre) => id),
      });
      // TODO WHEN FILE EXIST DO SOMETHING
      // this.uploadedFiles.push({
      //   name: this.book.title,
      //   cover_url: this.book.cover_url,
      // });
      // this.uploadedFiles = this.uploadedFiles;
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
          updated_by: this.#auth.getAuthenticatedUser(),
        } as UpdateBookDto);
        if (!result.success) {
          result.error.errors.map((err) =>
            this.#msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al editar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.updateBookMutation.mutateAsync(result.data!);
        this.#ref.close();
      }
      if (!this.isEditing) {
        const result = CreateBookSchema.safeParse({
          ...this.form.value,
          created_by: this.#auth.getAuthenticatedUser(),
        } as CreateBookDto);
        if (!result.success) {
          result.error.errors.map((err: any) =>
            this.#msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al guardar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.addBookMutation.mutateAsync(result.data!);
        this.#ref.close();
      }
    }
  }

  closeDialog(event: Event) {
    if (this.form.dirty) {
      return this.#confirmController.confirm({
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
        accept: () => this.#ref.close(),
      });
    }
    return this.#ref.close();
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
    this.#genreDialogRef = this.#modalController.open(GenreForm, {
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
    this.#genreDialogRef.onClose.subscribe((result) => {
      console.log(result);
    });
  }

  handleAuthorForm(
    author: Author | undefined,
    isEditing: boolean,
    event: Event
  ) {
    event.stopPropagation();
    this.#authorDialogRef = this.#modalController.open(AuthorForm, {
      width: '50%',
      height: 'auto',
      dismissableMask: false,
      modal: true,
      data: {
        author,
        isEditing,
      },
    });
    this.#authorDialogRef.onClose.subscribe((result) => {
      console.log(result);
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

  get uploadFn() {
    return this.#bookService.uploadCover.bind(this.#bookService);
  }
}
