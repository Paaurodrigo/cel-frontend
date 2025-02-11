/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Conexion.admin.plist.routedComponent } from './conexion.admin.plist.routed.component';

describe('Conexion.admin.plist.routedComponent', () => {
  let component: Conexion.admin.plist.routedComponent;
  let fixture: ComponentFixture<Conexion.admin.plist.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conexion.admin.plist.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conexion.admin.plist.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
