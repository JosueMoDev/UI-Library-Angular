import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { FileUpload } from 'primeng/fileupload';
import { Button } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { PrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

type UploadFn = (
  file: File,
  id: string,
  bucket: string,
  onProgressFn: (progress: number) => void
) => Promise<void>;

@Component({
  selector: 'upload-file',
  imports: [FileUpload, Button, ProgressBar],
  template: `<p-fileupload
    name="myfile[]"
    [customUpload]="true"
    [multiple]="false"
    accept="image/*"
    [maxFileSize]="3000000"
    (onSelect)="onSelectedFiles($event)"
  >
    <ng-template
      #header
      let-chooseCallback="chooseCallback"
      let-clearCallback="clearCallback"
    >
      <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
        <div class="flex gap-2">
          <p-button
            (onClick)="choose($event, chooseCallback)"
            icon="pi pi-images"
            [rounded]="true"
            [outlined]="true"
          />
          <p-button
            (onClick)="uploadEvent()"
            icon="pi pi-cloud-upload"
            [rounded]="true"
            [outlined]="true"
            severity="success"
            [disabled]="uploadFileMutation.isPending() || !file"
          />
        </div>
        @if(uploadFileMutation.isPending()){
        <p-progressbar
          [value]="uploadProgress()"
          [showValue]="false"
          class="w-full"
        >
        </p-progressbar>
        }
      </div>
    </ng-template>

    <ng-template #content>
      <div class="flex flex-col gap-8 pt-4"></div>
    </ng-template>

    <ng-template #empty>
      <div class="flex items-center justify-center flex-col">
        <i
          class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"
        ></i>
        <p class="mt-6 mb-0">Arrastra una imagen aquí para subirla.</p>
      </div>
    </ng-template>
  </p-fileupload>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent {
  #config: PrimeNG = inject(PrimeNG);
  #msgService = inject(MessageService);
  #queryClient = inject(QueryClient);
  file!: File | null;
  totalSize: number = 0;
  totalSizePercent: number = 0;
  uploadProgress = signal(0);
  dto = input.required<{
    id: string;
    bucket: string;
    uploadFn: UploadFn;
  }>();

  uploadFileMutation = injectMutation(() => ({
    mutationFn: async ({
      file,
      id,
      bucket,
    }: {
      file: File;
      id: string;
      bucket: string;
    }) =>
      await this.dto().uploadFn(file, id, bucket, (progress: number) =>
        this.uploadProgress.set(progress)
      ),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'cover picture was uploaded successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error) => {
      this.#msgService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error while upload cover picture: ${error.message}`,
        life: 3000,
      });
    },
  }));

  onSelectedFiles(event: { currentFiles: File[] }) {
    const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

    const originalFile = event.currentFiles[0];
    const extension = originalFile.name.split('.').pop()?.toLowerCase();

    const newFileName = `${this.dto().id}.${extension}`;

    const renamedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
    });

    this.file = renamedFile;

    this.totalSize = this.file.size;
    this.totalSizePercent = Math.min((this.totalSize / MAX_BYTES) * 100, 100);
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
    // this.msgService.add({
    //   severity: 'info',
    //   summary: 'Success',
    //   detail: 'File Uploaded',
    //   life: 3000,
    // });
  }

  async uploadEvent() {
    await this.uploadFileMutation.mutateAsync({
      file: this.file!,
      id: this.dto().id,
      bucket: this.dto().bucket,
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

  uploadedFiles: any[] = [];
}
