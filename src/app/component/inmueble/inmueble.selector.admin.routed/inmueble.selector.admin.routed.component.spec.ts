/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Inmueble.selector.admin.routedComponent } from './inmueble.selector.admin.routed.component';

describe('Inmueble.selector.admin.routedComponent', () => {
  let component: Inmueble.selector.admin.routedComponent;
  let fixture: ComponentFixture<Inmueble.selector.admin.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inmueble.selector.admin.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inmueble.selector.admin.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
