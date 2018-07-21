import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitToolbarComponent } from './submit-toolbar.component';

describe('SubmitToolbarComponent', () => {
  let component: SubmitToolbarComponent;
  let fixture: ComponentFixture<SubmitToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
