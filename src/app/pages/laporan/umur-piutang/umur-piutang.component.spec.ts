import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmurPiutangComponent } from './umur-piutang.component';

describe('UmurPiutangComponent', () => {
  let component: UmurPiutangComponent;
  let fixture: ComponentFixture<UmurPiutangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UmurPiutangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UmurPiutangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
