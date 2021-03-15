import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRegestrationComponent } from './chat-regestration.component';

describe('ChatRegestrationComponent', () => {
  let component: ChatRegestrationComponent;
  let fixture: ComponentFixture<ChatRegestrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRegestrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRegestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
