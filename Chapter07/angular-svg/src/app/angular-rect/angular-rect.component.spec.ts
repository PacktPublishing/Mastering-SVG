import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularRectComponent } from './angular-rect.component';

describe('AngularRectComponent', () => {
  let component: AngularRectComponent;
  let fixture: ComponentFixture<AngularRectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularRectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
