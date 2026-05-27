import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFilesComponent } from './tab-files.component';

describe('TabFilesComponent', () => {
  let component: TabFilesComponent;
  let fixture: ComponentFixture<TabFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
