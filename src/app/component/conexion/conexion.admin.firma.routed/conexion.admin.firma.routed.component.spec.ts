/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Conexion.admin.firma.routedComponent } from './conexion.admin.firma.routed.component';

describe('Conexion.admin.firma.routedComponent', () => {
  let component: Conexion.admin.firma.routedComponent;
  let fixture: ComponentFixture<Conexion.admin.firma.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conexion.admin.firma.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conexion.admin.firma.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
