import { Injectable, inject } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MessageServiceHandler {
  #msgService: MessageService = inject(MessageService);

  addMessege(msg: ToastMessageOptions) {
    this.#msgService.add(msg);
  }
}
