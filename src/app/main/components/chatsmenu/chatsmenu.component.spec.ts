import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsmenuComponent } from './chatsmenu.component';

describe('ChatsmenuComponent', () => {
  let component: ChatsmenuComponent;
  let fixture: ComponentFixture<ChatsmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatsmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
