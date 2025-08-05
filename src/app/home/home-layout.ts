import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookQuery } from './components/book-query/book-query';

@Component({
  selector: 'home-layout',
  imports: [RouterOutlet, BookQuery],
  template: `<div class="flex flex-col h-screen">
    <book-query />
    <div class="flex-1 overflow-y-auto">
      <router-outlet></router-outlet>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeLayout {}
