import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookQuery } from './components/book-query/book-query';

@Component({
  selector: 'home-layout',
  imports: [RouterOutlet, BookQuery],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeLayout {}
