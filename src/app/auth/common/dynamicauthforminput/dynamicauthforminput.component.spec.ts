import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicauthforminputComponent } from './dynamicauthforminput.component';

describe('DynamicauthforminputComponent', () => {
  let component: DynamicauthforminputComponent;
  let fixture: ComponentFixture<DynamicauthforminputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicauthforminputComponent]
    });
    fixture = TestBed.createComponent(DynamicauthforminputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
