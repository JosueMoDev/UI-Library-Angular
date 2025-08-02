import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreForm } from './genre-form';

describe('GenreModalComponent', () => {
  let component: GenreForm;
  let fixture: ComponentFixture<GenreForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
