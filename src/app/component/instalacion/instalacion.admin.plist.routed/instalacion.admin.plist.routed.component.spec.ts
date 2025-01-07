/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Instalacion.admin.plist.routedComponent } from './instalacion.admin.plist.routed.component';

describe('Instalacion.admin.plist.routedComponent', () => {
  let component: Instalacion.admin.plist.routedComponent;
  let fixture: ComponentFixture<Instalacion.admin.plist.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Instalacion.admin.plist.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Instalacion.admin.plist.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
