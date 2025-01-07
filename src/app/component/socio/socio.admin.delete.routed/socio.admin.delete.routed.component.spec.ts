/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Socio.admin.delete.routedComponent } from './socio.admin.delete.routed.component';

describe('Socio.admin.delete.routedComponent', () => {
  let component: Socio.admin.delete.routedComponent;
  let fixture: ComponentFixture<Socio.admin.delete.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Socio.admin.delete.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Socio.admin.delete.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
