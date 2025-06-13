import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly #drawerState: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {}

  get drawerState(): boolean {
    return this.#drawerState();
  }

  setDrawerState(state: boolean) {
    this.#drawerState.update(() => state);
  }
}
