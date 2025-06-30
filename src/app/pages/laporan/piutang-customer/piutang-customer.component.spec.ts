import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiutangCustomerComponent } from './piutang-customer.component';

describe('PiutangCustomerComponent', () => {
  let component: PiutangCustomerComponent;
  let fixture: ComponentFixture<PiutangCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiutangCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiutangCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
