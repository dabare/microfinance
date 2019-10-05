import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {LoanDepositsComponent} from './loan-deposits.component';


describe('LoanPlanComponent', () => {
  let component: LoanDepositsComponent;
  let fixture: ComponentFixture<LoanDepositsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDepositsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
