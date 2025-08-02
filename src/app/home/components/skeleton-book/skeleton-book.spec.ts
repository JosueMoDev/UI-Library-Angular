import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonBook } from './skeleton-book';

describe('SkeletonBookComponent', () => {
  let component: SkeletonBook;
  let fixture: ComponentFixture<SkeletonBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonBook],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
