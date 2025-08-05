import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'authors-page',
  imports: [],
  template: `<p>Authors works!</p>`,
  styleUrl: './authors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthorsPage {}
