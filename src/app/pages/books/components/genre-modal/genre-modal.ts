import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'genre-modal',
  imports: [Button, Card, ReactiveFormsModule, InputText],
  templateUrl: './genre-modal.html',
  styleUrl: './genre-modal.css',
})
export class GenreModal {
  private configDialog: DynamicDialogConfig<object> =
    inject(DynamicDialogConfig);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private genre: any;
  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.genre = this.configDialog.data;
    if (this.genre) {
      this.form.patchValue(this.genre);
    }
  }

  submit() {
    if (this.form.valid) {
      this.ref.close({ result: { ...this.form.value, id: this.genre.id } });
    }
  }
}
