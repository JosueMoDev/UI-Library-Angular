import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { Steps } from 'primeng/steps';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { PrimeNG } from 'primeng/config';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthenticationService } from '@services/authentication.service';
import {
  UpdateAuthorSchema,
  CreateAuthorSchema,
  CreateAuthorDto,
  UpdateAuthorDto,
} from '@home/dtos';
import { Author } from '@home/models';
import { AuthorsService } from '@home/services/authors.service';
import {
  QueryClient,
  injectQuery,
  injectMutation,
} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-author-modal',
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Button,
    ProgressBar,
    Steps,
    FileUpload,
    Card,
    ConfirmDialog,
    IconFieldModule,
    TableModule,
    MultiSelectModule,
  ],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css',
})
export class AuthorForm {
  readonly #ref: DynamicDialogRef = inject(DynamicDialogRef);
  readonly #configDialog: DynamicDialogConfig<{
    author: Author | undefined;
    isEditing: boolean;
  }> = inject(DynamicDialogConfig);
  #fb = inject(FormBuilder);
  #config: PrimeNG = inject(PrimeNG);
  readonly #auth = inject(AuthenticationService);
  #confirmController: ConfirmationService = inject(ConfirmationService);
  #authorService = inject(AuthorsService);
  #queryClient = inject(QueryClient);
  #msgService = inject(MessageService);

  author: Author | undefined;
  isEditing: boolean = false;

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  file!: File | null;
  totalSize: number = 0;
  totalSizePercent: number = 0;
  authors: any[] = [];
  selectedAuthors: any[] = [];

  form = this.#fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    age: [0, Validators.required],
    biography: ['', Validators.required],
    // nationality: ['', Validators.required],
  });

  uploadedFile!: {
    name: string;
    url: string | undefined;
  };

  allAuthorsQuery = injectQuery(() => ({
    queryKey: ['authors'],
    queryFn: async () => await this.#authorService.allAuthors(),
  }));

  addAuthorMutation = injectMutation(() => ({
    mutationFn: async (dto: CreateAuthorDto) =>
      await this.#authorService.addAuthor(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Author was created successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['authors'] });
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

  uploadFileMutation = injectMutation(() => ({
    mutationFn: async ({ dto, author }: { dto: File; author: Author }) =>
      await this.#authorService.updateProfilePicture(dto, author),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'profile picture was uploaded successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      this.#msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error while upload profile picture: ${error.message}`,
        life: 3000,
      });
    },
  }));

  updateActorMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateAuthorDto) =>
      await this.#authorService.updateAuthor(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Author was updated successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      this.#msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al actualizar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  ngOnInit(): void {
    this.author = this.#configDialog.data?.author;
    this.isEditing = this.#configDialog.data?.isEditing ?? false;

    if (this.author && this.isEditing) {
      this.form.patchValue(this.author);
      this.uploadedFile = {
        name: this.author.name,
        url: this.author.profile_picture_url,
      };
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
      if (this.isEditing && this.author) {
        const result = UpdateAuthorSchema.safeParse({
          id: this.author.id,
          ...this.form.value,
          updated_by: this.#auth.getAuthenticatedUser(),
        });
        if (!result.success) {
          result.error.errors.map((err) =>
            this.#msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al Editar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.updateActorMutation.mutateAsync(result.data!);
        this.#ref.close();
      }

      if (!this.isEditing) {
        const result = CreateAuthorSchema.safeParse({
          ...this.form.value,
          created_by: this.#auth.getAuthenticatedUser(),
        });
        if (!result.success) {
          result.error.errors.map((err) =>
            this.#msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al guardar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.addAuthorMutation.mutateAsync(result.data!);
        this.#ref.close();
      }
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
    this.#msgService.add({
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

    const newFileName = `${this.author?.id}.${extension}`;

    const renamedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
    });

    this.file = renamedFile;

    this.totalSize = this.file.size;
    this.totalSizePercent = Math.min((this.totalSize / MAX_BYTES) * 100, 100);
  }

  async uploadEvent() {
    await this.uploadFileMutation.mutateAsync({
      dto: this.file!,
      author: this.author!,
    });
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const MAX_BYTES = 3 * k * k;
    const sizes: string[] | undefined =
      this.#config.translation.fileSizeTypes ?? [];

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

  closeDialog(event: Event) {
    if (this.form.touched) {
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
        accept: () => {
          this.#confirmController.close();
          this.#ref.close();
        },
      });
    }
    return this.#ref.close();
  }
  changeStep(event: number) {
    this.steps![event].visible;
  }
}
