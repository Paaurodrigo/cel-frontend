/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Inmueble.client.view.routedComponent } from './inmueble.client.view.routed.component';

describe('Inmueble.client.view.routedComponent', () => {
  let component: Inmueble.client.view.routedComponent;
  let fixture: ComponentFixture<Inmueble.client.view.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inmueble.client.view.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inmueble.client.view.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
