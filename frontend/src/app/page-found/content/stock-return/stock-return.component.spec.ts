import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockReturn } from './stock-return.component';

describe('StockReturn', () => {
  let component: StockReturn;
  let fixture: ComponentFixture<StockReturn>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockReturn ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockReturn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
