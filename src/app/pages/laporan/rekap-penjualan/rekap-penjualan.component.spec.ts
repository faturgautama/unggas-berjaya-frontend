import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapPenjualanComponent } from './rekap-penjualan.component';

describe('RekapPenjualanComponent', () => {
  let component: RekapPenjualanComponent;
  let fixture: ComponentFixture<RekapPenjualanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RekapPenjualanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RekapPenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
