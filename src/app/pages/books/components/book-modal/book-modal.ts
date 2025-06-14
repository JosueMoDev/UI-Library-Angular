import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'book-modal',
  templateUrl: './book-modal.html',
  styleUrl: './book-modal.css',
  imports: [ButtonModule, InputTextModule],
})
export class BookModal {
  private ref: DynamicDialogRef = inject(DynamicDialogRef);

  ngOnInit(): void {
    setInterval(() => {
      this.ref.close({
        name: 'Jonas',
        lastname: 'Morales',
      });
    }, 3000);
  }
}
