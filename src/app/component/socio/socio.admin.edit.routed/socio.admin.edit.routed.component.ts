import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ISocio } from '../../../model/socio.interface';
import { SocioService } from '../../../service/socio.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, Subject } from 'rxjs';

declare let bootstrap: any;

@Component({
  selector: 'app-socio.admin.edit.routed',
  templateUrl: './socio.admin.edit.routed.component.html',
  styleUrls: ['./socio.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class SocioAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oSocioForm: FormGroup = new FormGroup({});
  oSocio: ISocio | null = null;
  strMessage: string = '';
  esExito: boolean = true; // ✅ Cambiado por claridad
  emailExiste: boolean = false;

  emailSubject: Subject<string> = new Subject<string>();
  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oSocioService: SocioService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oSocioForm?.markAllAsTouched();

    this.emailSubject.pipe(debounceTime(1000)).subscribe((email) => {
      if (!email) {
        this.emailExiste = false;
      } else {
        this.checkEmailExists(email);
      }
    });
  }

  createForm() {
    this.oSocioForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      apellido1: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      apellido2: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      direccionfiscal: new FormControl('', [Validators.required]),
      codigopostal: new FormControl('', [Validators.required]),
    });
  }

  onReset() {
    this.oSocioService.get(this.id).subscribe({
      next: (oSocio: ISocio) => {
        this.oSocio = oSocio;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oSocioForm?.patchValue(this.oSocio!);
  }

  get() {
    this.oSocioService.get(this.id).subscribe({
      next: (oSocio: ISocio) => {
        this.oSocio = oSocio;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  showModal(strMessage: string, exito: boolean = true) {
    this.strMessage = strMessage;
    this.esExito = exito;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/socio/plist/']);
  };

  onEmailChange(): void {
    const email = this.oSocioForm.get('email')?.value;
    this.emailSubject.next(email);
  }

  onSubmit() {
    if (!this.oSocioForm?.valid) {
      this.showModal('Formulario no válido', false); // ❌
      return;
    }

    this.oSocioService.update(this.oSocioForm?.value).subscribe({
      next: (oSocio: ISocio) => {
        this.oSocio = oSocio;
        this.updateForm();
        this.showModal('Socio ' + this.oSocio.id + ' actualizado', true); // ✅
      },
      error: (error) => {
        this.showModal('Error al actualizar el usuario', false); // ❌
        console.error(error);
      },
    });
  }

  private checkEmailExists(email: string): void {
    this.oSocioService.checkEmailExists(email).subscribe({
      next: (existe: boolean) => {
        this.emailExiste = existe;
        this.oSocioForm.get('email')?.markAsTouched();
        this.oSocioForm.get('email')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error checking email existence', err);
        this.emailExiste = false;
      },
    });
  }
}
