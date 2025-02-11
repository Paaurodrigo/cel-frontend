/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Inmueble.client.create.routedComponent } from './inmueble.client.create.routed.component';

describe('Inmueble.client.create.routedComponent', () => {
  let component: Inmueble.client.create.routedComponent;
  let fixture: ComponentFixture<Inmueble.client.create.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inmueble.client.create.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inmueble.client.create.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
