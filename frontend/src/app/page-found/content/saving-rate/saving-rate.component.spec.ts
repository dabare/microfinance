import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SavingRateComponent} from './saving-rate.component';


describe('SavingRateComponent', () => {
  let component: SavingRateComponent;
  let fixture: ComponentFixture<SavingRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
