import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsMenuComponent } from './questions-menu.component';

describe('QuestionsMenuComponent', () => {
  let component: QuestionsMenuComponent;
  let fixture: ComponentFixture<QuestionsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
