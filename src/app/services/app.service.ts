import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  state: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {}

  get drawerState(): boolean {
    return this.state();
  }

  setDrawerState(state: boolean) {
    this.state.update(() => state);
  }
}
