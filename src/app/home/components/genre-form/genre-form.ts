import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

import { AuthenticationService } from '@services/authentication.service';
import {
  CreateGenreDto,
  UpdateGenreDto,
  UpdateGenreSchema,
  CreateGenreSchema,
} from '@home/dtos';
import { Genre } from '@home/models';
import { GenresService } from '@home/services';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'genre-form',
  imports: [ReactiveFormsModule, Card, Button, InputText],
  template: `<p-card>
    <ng-template #title> Book Genre </ng-template>
    <form class="m-5" [formGroup]="form" (submit)="submit()">
      <div class="grid gap-4">
        <input pInputText formControlName="name" placeholder="Título" />
        <textarea
          pInputText
          pSize="large"
          id="description"
          formControlName="description"
          rows="5"
          cols="30"
        ></textarea>
        <label for="description">Description</label>
      </div>

      <div class="flex gap-4 mt-1 pt-10">
        <p-button
          label="Save"
          class="w-full"
          styleClass="w-full"
          pButton
          label="Guardar"
          type="submit"
          severity="success"
          [loading]="
            isEditing
              ? updateGenreMutation.isPending()
              : addGenreMutation.isPending()
          "
          [disabled]="form.invalid"
        />
      </div>
    </form>
  </p-card>`,
})
export class GenreForm {
  // PrimeNG
  readonly #ref: DynamicDialogRef = inject(DynamicDialogRef);
  readonly #configDialog: DynamicDialogConfig<{
    genre: Genre | undefined;
    isEditing: boolean;
  }> = inject(DynamicDialogConfig);
  #msgService = inject(MessageService);

  #fb = inject(FormBuilder);
  #queryClient = inject(QueryClient);
  readonly #auth = inject(AuthenticationService);
  private genre: Genre | undefined;
  #genreService: GenresService = inject(GenresService);

  form = this.#fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });
  isEditing: boolean = false;

  ngOnInit(): void {
    this.genre = this.#configDialog.data?.genre;
    this.isEditing = this.#configDialog.data!.isEditing;
    if (this.genre && this.isEditing) {
      this.form.patchValue(this.genre);
    }
  }

  // Queries

  allGenresQuery = injectQuery(() => ({
    queryKey: ['genres'],
    queryFn: () => this.#genreService.allGenres(),
  }));

  // Methods

  addGenreMutation = injectMutation(() => ({
    mutationFn: async (dto: CreateGenreDto) =>
      await this.#genreService.addGenre(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Genre was created successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['genres'] });
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

  updateGenreMutation = injectMutation(() => ({
    mutationFn: async (dto: UpdateGenreDto) =>
      await this.#genreService.updateGenre(dto),
    onSuccess: () => {
      this.#msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Genre was update successfully',
        life: 3000,
      });
      this.#queryClient.invalidateQueries({ queryKey: ['genres'] });
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

  async submit() {
    if (this.form.valid) {
      if (this.isEditing && this.genre) {
        const result = UpdateGenreSchema.safeParse({
          id: this.genre.id,
          ...this.form.value,
          updated_by: this.#auth.getAuthenticatedUser(),
        } as UpdateGenreDto);
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
        await this.updateGenreMutation.mutateAsync(result.data!);
        this.#ref.close();
      }
      if (!this.isEditing) {
        const result = CreateGenreSchema.safeParse({
          ...this.form.value,
          created_by: this.#auth.getAuthenticatedUser(),
        } as CreateGenreDto);
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
        await this.addGenreMutation.mutateAsync(result.data!);
        this.#ref.close();
      }
    }
  }
}
