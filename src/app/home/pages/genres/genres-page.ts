import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'genres-page',
  imports: [],
  template: `<p>Genre works!</p>`,
  styleUrl: './genres-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenresPage {}
