import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
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
import { DropdownModule } from 'primeng/dropdown';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { AuthorsService } from '@pages/authors/authors.service';

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
    DropdownModule,
    Card,
    ConfirmDialog,
    IconFieldModule,
    TableModule,
    InputIcon,
  ],
})
export class BookModal {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);
  private fb = inject(FormBuilder);
  private config: PrimeNG = inject(PrimeNG);
  private messageService: MessageService = inject(MessageService);
  private confirmController: ConfirmationService = inject(ConfirmationService);
  private authorService: AuthorsService = inject(AuthorsService);

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  files!: File[];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  book: any | undefined;
  authors: any[] = [];
  selectedAuthors: any[] = [];

  form = this.fb.group({
    title: ['EL ALQUIMISTA', Validators.required],
    price: [20, Validators.required],
    description: ['', Validators.required],
    category: [null, Validators.required],
    genre: [null, Validators.required],
    authors: [[], Validators.required],
    physicalEnable: [false],
  });

  genres = [
    { label: 'Novela', value: 'f59e5a44-21b0-4b7c-9ed7-80977d119f6e' },
    { label: 'Ciencia', value: '9876d52a-b49c-44b9-8b94-5130a9b0ea90' },
    { label: 'Ficción', value: 'f396a404-4629-4209-b2b7-5d56fa25149b' },
    { label: 'Aventura', value: '742db2c8-9f8e-41bb-b029-799e6b4cfcd3' },
    { label: 'Romance', value: 'd1fe8e26-e8b0-4e7f-a8a6-f3d97dba7a57' },
    { label: 'Terror', value: 'b799ef99-b59f-4c8b-9385-544e9ef704b9' },
    { label: 'Misterio', value: '24db85ed-19a5-4185-bdc1-5eb0d5e65f59' },
    { label: 'Fábula', value: 'c11a09e9-d2a9-457b-a395-ecdbfdde4005' },
    { label: 'Suspenso', value: '7c15edee-e63c-4a71-a1cc-6be6ea0a4087' },
    { label: 'Histórica', value: 'd8fa90c4-8f97-4632-a877-c41f0d5fe2bb' },
    { label: 'Experimental', value: 'abfc3bdf-12f4-4315-948d-3f99f8d8a3b5' },
    { label: 'Realismo mágico', value: '865e63b5-dfb4-45fa-a80e-bfbd09ad29fd' },
    { label: 'Futurista', value: 'af3226b7-7b83-4dfb-a52a-0417cb3c251f' },
    { label: 'Ciencia ficción', value: 'a3707382-bb1b-4882-9b29-5ef72f091b23' },
    { label: 'Drama', value: '9f23ea0b-0b6b-42f0-9d8a-b1b01ac7f04b' },
    { label: 'Juvenil', value: '6e620d84-d1a2-4424-bd4b-e4f788518ff5' },
    { label: 'Clásicos', value: '9cfb7886-5b2d-49b5-835b-0b8d283e8f73' },
  ];

  categories = [
    { label: 'Ficción', value: 'c97f1c9d-167a-4f90-bd89-b4b2708b531b' },
    { label: 'Tecnología', value: '61fc5f1f-02c3-42da-a585-25b51d515ee3' },
    { label: 'Literatura', value: '10ad10ff-c5b2-4d5b-bb43-256b682f4eaf' },
    { label: 'Ciencia', value: '63b86a62-8c34-44c3-b91f-ff3a0e4f0d60' },
    { label: 'Clásicos', value: '9a2b8e90-71c1-4b62-8ad4-606c395fd212' },
    { label: 'Juvenil', value: '12a47017-80f4-43f8-bd61-75059f6b2329' },
    { label: 'Terror', value: '4a8b9d52-0385-429f-952d-90bdf5c72b59' },
    { label: 'Misterio', value: 'f312c05f-c22f-431d-b2b4-60ad5cb5b045' },
    { label: 'Romance', value: 'c77d347e-762b-49d4-87cd-99fd6b9ccff1' },
    { label: 'Aventura', value: '3c27660f-d576-45fa-b35f-b77b9e7d0631' },
    { label: 'Drama', value: '98e8d220-dfe3-4c9a-b12b-983b038229f5' },
    { label: 'Histórica', value: '7684df6a-e5a5-45eb-bf1d-b463b18b9d15' },
    { label: 'Fábula', value: 'ba90ed68-7240-433f-b6c9-9ad1fd5021f2' },
    { label: 'Suspenso', value: '05d85591-b024-4603-aed2-5b48e65b09ed' },
    { label: 'Realismo mágico', value: '5a63b273-4c11-4a67-bbe7-8f79b3421b92' },
    { label: 'Futurista', value: '1b9cf632-eed7-401d-9380-88c923a907d1' },
  ];

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.book = this.configDialog.data;
    this.authors = this.authorService.authors;
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
    console.log(input.value);
  }
}
