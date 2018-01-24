import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatToolsPluginComponent } from './formattoolsplugin.component';

describe('FormatToolsPluginComponent', () => {
  let component: FormatToolsPluginComponent;
  let fixture: ComponentFixture<FormatToolsPluginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatToolsPluginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatToolsPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
