import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
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
import { AuthenticationService } from 'src/app/authentication/authentication.service';
@Component({
  selector: 'genre-modal',
  imports: [Button, Card, ReactiveFormsModule, InputText],
  templateUrl: './genre-modal.html',
  styleUrl: './genre-modal.css',
})
export class GenreModal {
  private readonly ref: DynamicDialogRef = inject(DynamicDialogRef);
  private genreService: GenresService = inject(GenresService);
  queryClient = inject(QueryClient);
  private fb = inject(FormBuilder);
  private readonly auth = inject(AuthenticationService);
  private readonly msgService = inject(MessageService);
  private readonly configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);
  isEditing: boolean = false;

  private genre = this.configDialog.data;
  mutation = injectMutation(() => ({
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

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.genre) {
      this.isEditing = true;
      this.form.patchValue(this.genre);
    }
  }

  async submit() {
    if (this.form.valid) {
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
      if (this.isEditing) {
      } else {
        await this.mutation.mutateAsync(result.data!);
      }
      this.ref.close();
    }
  }
}
