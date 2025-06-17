import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorModal } from './author-modal';

describe('AuthorModalComponent', () => {
  let component: AuthorModal;
  let fixture: ComponentFixture<AuthorModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
