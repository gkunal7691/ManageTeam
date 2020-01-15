import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyOverviewBoxComponent } from './daily-overview-box.component';

describe('DailyOverviewBoxComponent', () => {
  let component: DailyOverviewBoxComponent;
  let fixture: ComponentFixture<DailyOverviewBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyOverviewBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyOverviewBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
