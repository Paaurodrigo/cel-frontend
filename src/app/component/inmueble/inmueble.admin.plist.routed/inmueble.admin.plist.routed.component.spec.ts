/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Inmueble.admin.plist.routedComponent } from './inmueble.admin.plist.routed.component';

describe('Inmueble.admin.plist.routedComponent', () => {
  let component: Inmueble.admin.plist.routedComponent;
  let fixture: ComponentFixture<Inmueble.admin.plist.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inmueble.admin.plist.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inmueble.admin.plist.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
