/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Socio.admin.create.routedComponent } from './socio.admin.create.routed.component';

describe('Socio.admin.create.routedComponent', () => {
  let component: Socio.admin.create.routedComponent;
  let fixture: ComponentFixture<Socio.admin.create.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Socio.admin.create.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Socio.admin.create.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
