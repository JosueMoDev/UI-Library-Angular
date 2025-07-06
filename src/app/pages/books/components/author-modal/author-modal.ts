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
    Badge,
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

  author: any | undefined;
  isEditing: boolean = false;

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  files!: File[];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  authors: any[] = [];
  selectedAuthors: any[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    age: ['', Validators.required],
    biography: ['', Validators.required],
    // nationality: ['', Validators.required],
  });

  mutation = injectMutation(() => ({
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

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.author = this.configDialog.data;
    if (this.author) {
      this.isEditing = true;
      this.form.patchValue(this.author);
      this.uploadedFiles.push({
        name: this.author.name,
        objectURL: this.author.image,
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
}
