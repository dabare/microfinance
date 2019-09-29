import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturn } from './sales-return.component';

describe('SalesReturn', () => {
  let component: SalesReturn;
  let fixture: ComponentFixture<SalesReturn>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReturn ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
