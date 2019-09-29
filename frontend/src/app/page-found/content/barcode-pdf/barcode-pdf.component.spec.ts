import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BarcodePdfComponent} from './barcode-pdf.component';

describe('BarcodePdfComponent', () => {
  let component: BarcodePdfComponent;
  let fixture: ComponentFixture<BarcodePdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BarcodePdfComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
