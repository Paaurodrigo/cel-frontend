/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Socio.admin.view.routedComponent } from './socio.admin.view.routed.component';

describe('Socio.admin.view.routedComponent', () => {
  let component: Socio.admin.view.routedComponent;
  let fixture: ComponentFixture<Socio.admin.view.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Socio.admin.view.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Socio.admin.view.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
