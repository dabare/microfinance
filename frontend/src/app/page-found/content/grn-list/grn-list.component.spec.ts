import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GRNListComponent } from './grn-list.component';

describe('GRNListComponent', () => {
  let component: GRNListComponent;
  let fixture: ComponentFixture<GRNListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GRNListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GRNListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
