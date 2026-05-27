import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelmVersionSelectComponent } from './helm-version-select.component';

describe('HelmVersionSelectComponent', () => {
  let component: HelmVersionSelectComponent;
  let fixture: ComponentFixture<HelmVersionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelmVersionSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelmVersionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
