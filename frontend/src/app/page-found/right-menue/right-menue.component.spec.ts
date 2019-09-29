import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMenueComponent } from './right-menue.component';

describe('RightMenueComponent', () => {
  let component: RightMenueComponent;
  let fixture: ComponentFixture<RightMenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightMenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
