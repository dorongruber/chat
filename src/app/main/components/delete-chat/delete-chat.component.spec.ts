import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletechatComponent } from './delete-chat.component';

describe('DeletechatComponent', () => {
  let component: DeletechatComponent;
  let fixture: ComponentFixture<DeletechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletechatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
