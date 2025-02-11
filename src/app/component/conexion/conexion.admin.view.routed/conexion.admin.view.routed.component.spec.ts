/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Conexion.admin.view.routedComponent } from './conexion.admin.view.routed.component';

describe('Conexion.admin.view.routedComponent', () => {
  let component: Conexion.admin.view.routedComponent;
  let fixture: ComponentFixture<Conexion.admin.view.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conexion.admin.view.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conexion.admin.view.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
