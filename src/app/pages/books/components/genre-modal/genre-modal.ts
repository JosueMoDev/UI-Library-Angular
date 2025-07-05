import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CreateGenreDto,
  CreateGenreSchema,
} from '@pages/books/dtos/create-genre.dto';
import { IGenre } from '@pages/books/interfaces/genre.interface';
import { GenresService } from '@pages/books/services/genres.service';
import {
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthenticationService } from 'src/app/authentication/authentication.service';

@Component({
  selector: 'genre-modal',
  imports: [Button, Card, ReactiveFormsModule, InputText, ToastModule],
  templateUrl: './genre-modal.html',
  styleUrl: './genre-modal.css',
  providers: [MessageService],
})
export class GenreModal {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private genreService: GenresService = inject(GenresService);
  queryClient = inject(QueryClient);
  private fb = inject(FormBuilder);
  private readonly auth = inject(AuthenticationService);
  private msgService = inject(MessageService);
  private configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);

  private genre = this.configDialog.data;
  mutation = injectMutation(() => ({
    mutationFn: (dto: CreateGenreDto) => this.genreService.addGenre(dto),
    onSuccess: (genre) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Genre was created successfully',
        life: 3000,
      });
      this.ref.close({ result: genre });
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
            severity: 'error',
            summary: 'Error',
            detail: `Error al guardar: ${err.message}`,
            life: 3000,
          })
        );
      }

      this.mutation.mutate(result.data!);
      this.ref.close({ result: { ...this.form.value } });
    }
  }
}
