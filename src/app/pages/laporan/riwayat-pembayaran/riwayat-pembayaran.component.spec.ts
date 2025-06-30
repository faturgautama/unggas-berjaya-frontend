import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiwayatPembayaranComponent } from './riwayat-pembayaran.component';

describe('RiwayatPembayaranComponent', () => {
  let component: RiwayatPembayaranComponent;
  let fixture: ComponentFixture<RiwayatPembayaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiwayatPembayaranComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiwayatPembayaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
