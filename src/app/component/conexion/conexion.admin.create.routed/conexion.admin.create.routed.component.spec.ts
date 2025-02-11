/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConexionAdminCreateRoutedComponent } from './conexion.admin.create.routed.component';

describe('Conexion.admin.create.routedComponent', () => {
  let component: Conexion.admin.create.routedComponent;
  let fixture: ComponentFixture<Conexion.admin.create.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Conexion.admin.create.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Conexion.admin.create.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
