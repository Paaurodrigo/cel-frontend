/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Conexion.admin.delete.routedComponent } from './conexion.admin.delete.routed.component';

describe('Conexion.admin.delete.routedComponent', () => {
  let component: Conexion.admin.delete.routedComponent;
  let fixture: ComponentFixture<Conexion.admin.delete.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conexion.admin.delete.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conexion.admin.delete.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
