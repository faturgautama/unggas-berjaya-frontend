import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PembayaranMasukComponent } from './pembayaran-masuk.component';

describe('PembayaranMasukComponent', () => {
  let component: PembayaranMasukComponent;
  let fixture: ComponentFixture<PembayaranMasukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PembayaranMasukComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PembayaranMasukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
