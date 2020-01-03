import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteTodoTaskComponent } from './complete-todo-task.component';

describe('CompleteTodoTaskComponent', () => {
  let component: CompleteTodoTaskComponent;
  let fixture: ComponentFixture<CompleteTodoTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteTodoTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteTodoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
