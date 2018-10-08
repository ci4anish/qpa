import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyAnswerComponent } from './empty-answer.component';

describe('EmptyAnswerComponent', () => {
  let component: EmptyAnswerComponent;
  let fixture: ComponentFixture<EmptyAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
