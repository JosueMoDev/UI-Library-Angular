import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonBookComponent } from './skeleton-book';

describe('SkeletonBookComponent', () => {
  let component: SkeletonBookComponent;
  let fixture: ComponentFixture<SkeletonBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonBookComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
