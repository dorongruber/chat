import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatmenuitemComponent } from './chat-menu-item.component';

describe('ChatmenuitemComponent', () => {
  let component: ChatmenuitemComponent;
  let fixture: ComponentFixture<ChatmenuitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatmenuitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatmenuitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
