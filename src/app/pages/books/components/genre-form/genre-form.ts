import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  CreateGenreDto,
  CreateGenreSchema,
} from '@pages/books/dtos/create-genre.dto';
import { GenresService } from '@pages/books/services/genres.service';
import { AuthenticationService } from '@services/authentication.service';
import {
  UpdateGenreDto,
  UpdateGenreSchema,
} from '@pages/books/dtos/update-genre.dto';
import { Genre } from '@pages/books/models/genre.model';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
@Component({
  selector: 'genre-form',
  imports: [ReactiveFormsModule, Card, Button, InputText],
  templateUrl: './genre-form.html',
  styleUrl: './genre-form.css',
})
export class GenreForm {
  private readonly ref: DynamicDialogRef = inject(DynamicDialogRef);
  private genreService: GenresService = inject(GenresService);
  queryClient = inject(QueryClient);
  private fb = inject(FormBuilder);
  private readonly auth = inject(AuthenticationService);
  private readonly msgService = inject(MessageService);
  private readonly configDialog: DynamicDialogConfig<{
    genre: Genre | undefined;
    isEditing: boolean;
  }> = inject(DynamicDialogConfig);
  isEditing: boolean = false;

  private genre: Genre | undefined;
  createMutation = injectMutation(() => ({
    mutationFn: async (dto: CreateGenreDto) =>
      await this.genreService.addGenre(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Genre was created successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['genres'] });
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
    mutationFn: async (dto: UpdateGenreDto) =>
      await this.genreService.updateGenre(dto),
    onSuccess: () => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Genre was update successfully',
        life: 3000,
      });
      this.queryClient.invalidateQueries({ queryKey: ['genres'] });
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

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.genre = this.configDialog.data?.genre;
    this.isEditing = this.configDialog.data!.isEditing;
    if (this.genre && this.isEditing) {
      this.form.patchValue(this.genre);
    }
  }

  async submit() {
    if (this.form.valid) {
      if (this.isEditing && this.genre) {
        const result = UpdateGenreSchema.safeParse({
          id: this.genre.id,
          ...this.form.value,
          updated_by: this.auth.getAuthenticatedUser(),
        } as UpdateGenreDto);
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
        await this.updateMutation.mutateAsync(result.data!);
        this.ref.close();
      }
      if (!this.isEditing) {
        const result = CreateGenreSchema.safeParse({
          ...this.form.value,
          created_by: this.auth.getAuthenticatedUser(),
        } as CreateGenreDto);
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
}
