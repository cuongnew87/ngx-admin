import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickGenerateComponent } from './quick-generate.component';

describe('QuickGenerateComponent', () => {
  let component: QuickGenerateComponent;
  let fixture: ComponentFixture<QuickGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickGenerateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
