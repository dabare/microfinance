import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenueBarComponent } from './menue-bar.component';

describe('MenueBarComponent', () => {
  let component: MenueBarComponent;
  let fixture: ComponentFixture<MenueBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenueBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenueBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
