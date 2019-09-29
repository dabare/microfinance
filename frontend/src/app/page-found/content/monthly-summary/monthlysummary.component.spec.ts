import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySummaryComponent } from './monthlysummary.component';

describe('MonthlySummaryComponent', () => {
  let component: MonthlySummaryComponent;
  let fixture: ComponentFixture<MonthlySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
