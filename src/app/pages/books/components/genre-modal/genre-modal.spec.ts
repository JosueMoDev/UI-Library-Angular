import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreModal } from './genre-modal';

describe('GenreModalComponent', () => {
  let component: GenreModal;
  let fixture: ComponentFixture<GenreModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreModal],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
