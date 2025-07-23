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
import {
  CreateAuthorDto,
  CreateAuthorSchema,
} from '@pages/books/dtos/create-author.dto';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { AuthorsService } from '@pages/books/services/authors.service';
import {
  UpdateAuthorDto,
  UpdateAuthorSchema,
} from '@pages/books/dtos/update-author.dto';
import { Author } from '@pages/books/models/author.model';

@Component({
  selector: 'app-author-modal',
  imports: [
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Button,
    Toast,
    ProgressBar,
    Steps,
    FileUpload,
    Card,
    ConfirmDialog,
    IconFieldModule,
    TableModule,
    MultiSelectModule,
  ],
  templateUrl: './author-modal.html',
  styleUrl: './author-modal.css',
})
export class AuthorModal {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  modalController: DialogService = inject(DialogService);
  private configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);
  private config: PrimeNG = inject(PrimeNG);
  private msgService: MessageService = inject(MessageService);
  private readonly auth = inject(AuthenticationService);
  private confirmController: ConfirmationService = inject(ConfirmationService);
  private authorService = inject(AuthorsService);
  private queryClient = inject(QueryClient);

  author: Author | undefined;
  isEditing: boolean = false;

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  file!: File | null;
  totalSize: number = 0;
  totalSizePercent: number = 0;
  authors: any[] = [];
  selectedAuthors: any[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    age: [0, Validators.required],
    biography: ['', Validators.required],
    // nationality: ['', Validators.required],
  });

  createMutation = injectMutation(() => ({
    mutationFn: async (dto: CreateAuthorDto) =>
      await this.authorService.addAuthor(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Author was created successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['authors'] });
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

  fileMutation = injectMutation(() => ({
    mutationFn: async ({ dto, author }: { dto: File; author: Author }) =>
      await this.authorService.uploadFile(dto, author),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'profile picture was uploaded successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error while upload profile picture: ${error.message}`,
        life: 3000,
      });
    },
  }));

  updateMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateAuthorDto) =>
      await this.authorService.updateAuthor(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Author was updated successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => {
      this.msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error al actualizar: ${error.message}`,
        life: 3000,
      });
    },
  }));

  uploadedFile!: {
    name: string;
    url: string | undefined;
  };

  ngOnInit(): void {
    this.author = this.configDialog.data as Author;
    if (this.author) {
      this.isEditing = true;
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
          updated_by: this.auth.getAuthenticatedUser(),
        });
        if (!result.success) {
          result.error.errors.map((err) =>
            this.msgService.add({
              key: err.code,
              severity: 'error',
              summary: 'Error',
              detail: `Error al Editar: ${err.message}`,
              life: 3000,
            })
          );
        }
        await this.updateMutation.mutateAsync(result.data!);
        this.ref.close();
      }

      if (!this.isEditing) {
        const result = CreateAuthorSchema.safeParse({
          ...this.form.value,
          created_by: this.auth.getAuthenticatedUser(),
        });
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
        await this.createMutation.mutateAsync(result.data!);
        this.ref.close();
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

    const newFileName = `${this.author?.id}.${extension}`;

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
      author: this.author!,
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
}
