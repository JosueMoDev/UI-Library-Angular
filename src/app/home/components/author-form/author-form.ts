import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button, ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Steps } from 'primeng/steps';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Card } from 'primeng/card';
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
import { UploadFileComponent } from '../upload-file/upload-file';
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
    Steps,
    Card,
    IconFieldModule,
    TableModule,
    MultiSelectModule,
    UploadFileComponent,
  ],
  template: `<p-card>
    <div class="absolute top-0 right-0 p-2">
      <button
        class="p-button p-button-text p-button-rounded"
        (click)="closeDialog($event)"
      >
        <i class="pi pi-times"></i>
      </button>
    </div>
    <ng-template #header>
      <div class="card pb-3 ng">
        <p-steps
          [model]="steps"
          [readonly]="false"
          [activeIndex]="step()"
          (activeIndexChange)="step.set($event)"
        />
      </div>
    </ng-template>
    <ng-template #title> Crear Author </ng-template>
    <form class="m-5" [formGroup]="form">
      @if(step() === 0) {
      <div class="grid gap-4">
        <input pInputText formControlName="name" placeholder="Name" />
        <input pInputText formControlName="lastname" placeholder="Lastname" />
        <input
          pInputText
          type="number"
          formControlName="age"
          placeholder="Age"
        />

        <textarea
          pInputText
          pSize="large"
          id="biography"
          formControlName="biography"
          rows="5"
          cols="30"
        ></textarea>
        <label for="description">Biography</label>
      </div>
      } @if (step() === 1) {
      <upload-file
        [dto]="{ id: author!.id, bucket: 'author-profile', uploadFn }"
      />

      }

      <div class="flex justify-between mt-6"></div>
    </form>
    <ng-template #footer>
      <div class="flex gap-4 mt-1">
        <p-button
          label="Guardar"
          class="w-full"
          styleClass="w-full"
          type="submit"
          severity="success"
          [disabled]="
            form.invalid ||
            (isEditing
              ? updateActorMutation.isPending()
              : addAuthorMutation.isPending())
          "
          [loading]="
            isEditing
              ? updateActorMutation.isPending()
              : addAuthorMutation.isPending()
          "
          (onClick)="submit()"
        ></p-button>
      </div>
    </ng-template>
  </p-card>`,
})
export class AuthorForm {
  readonly #ref: DynamicDialogRef = inject(DynamicDialogRef);
  readonly #configDialog: DynamicDialogConfig<{
    author: Author | undefined;
    isEditing: boolean;
  }> = inject(DynamicDialogConfig);
  #fb = inject(FormBuilder);
  readonly #auth = inject(AuthenticationService);
  #confirmController: ConfirmationService = inject(ConfirmationService);
  #authorService = inject(AuthorsService);
  #queryClient = inject(QueryClient);
  #msgService = inject(MessageService);

  author: Author | undefined;
  isEditing: boolean = false;

  step = signal<number>(0);
  steps: MenuItem[] | undefined;
  authors: any[] = [];
  selectedAuthors: any[] = [];

  form = this.#fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    age: [0, Validators.required],
    biography: ['', Validators.required],
    // nationality: ['', Validators.required],
  });

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
      // this.uploadedFile = {
      //   name: this.author.name,
      //   url: this.author.profile_picture_url,
      // };
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
        accept: () => this.#ref.close({ hasFiles: true }),
      });
    }
    return this.#ref.close();
  }
  changeStep(event: number) {
    this.steps![event].visible;
  }

  get uploadFn() {
    return this.#authorService.updateProfilePicture.bind(this.#authorService);
  }
}
