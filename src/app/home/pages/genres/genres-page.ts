import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'genres-page',
  imports: [],
  template: `<p>Genre works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenresPage {}
