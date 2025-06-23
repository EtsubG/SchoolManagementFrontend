import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjectDialog } from './add-subject-dialog';

describe('AddSubjectDialog', () => {
  let component: AddSubjectDialog;
  let fixture: ComponentFixture<AddSubjectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubjectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubjectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
