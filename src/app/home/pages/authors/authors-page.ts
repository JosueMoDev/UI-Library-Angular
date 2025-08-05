import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'authors-page',
  imports: [],
  template: `<p>Authors works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthorsPage {}
