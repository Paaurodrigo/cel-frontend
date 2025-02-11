/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Inmueble.client.plist.routedComponent } from './inmueble.client.plist.routed.component';

describe('Inmueble.client.plist.routedComponent', () => {
  let component: Inmueble.client.plist.routedComponent;
  let fixture: ComponentFixture<Inmueble.client.plist.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inmueble.client.plist.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inmueble.client.plist.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
