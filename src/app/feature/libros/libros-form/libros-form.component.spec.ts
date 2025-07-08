import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosFormComponent } from './libros-form.component';

describe('LibrosFormComponent', () => {
  let component: LibrosFormComponent;
  let fixture: ComponentFixture<LibrosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
