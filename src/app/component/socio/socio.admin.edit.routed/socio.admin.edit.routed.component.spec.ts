/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Socio.admin.edit.routedComponent } from './socio.admin.edit.routed.component';

describe('Socio.admin.edit.routedComponent', () => {
  let component: Socio.admin.edit.routedComponent;
  let fixture: ComponentFixture<Socio.admin.edit.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Socio.admin.edit.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Socio.admin.edit.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
