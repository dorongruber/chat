import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavselectorComponent } from './sidenavselector.component';

describe('SidenavselectorComponent', () => {
  let component: SidenavselectorComponent;
  let fixture: ComponentFixture<SidenavselectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavselectorComponent]
    });
    fixture = TestBed.createComponent(SidenavselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
