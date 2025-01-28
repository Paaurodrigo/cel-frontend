import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,  
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Component, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-inmueble.admin.create.routed',
  templateUrl: './inmueble.admin.create.routed.component.html',
  styleUrls: ['./inmueble.admin.create.routed.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class InmuebleAdminCreateRoutedComponent implements OnInit {
  oInmuebleForm: FormGroup | undefined = undefined;
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  constructor( private oInmuebleService: InmuebleService,
    private oRouter: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.oInmuebleForm?.markAllAsTouched();
  }

  createForm() {
    this.oInmuebleForm = this.fb.group({
      cups: ['', [Validators.minLength(3), Validators.maxLength(50)]], // Ahora no es obligatorio
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      refCatas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      potencia1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      potencia2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      tension: ['', ], // Ejemplo: 220V o 5kV
      uso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }
  
  
  showModal(mensaje: string): void {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal(): void {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/inmueble/plist']);
  }

  onReset(): void {
    this.oInmuebleForm?.reset(); // Usa el método reset de Angular
  }
  onSubmit() {
    if (this.oInmuebleForm?.invalid) {
      this.showModal('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    this.oInmuebleService.create(this.oInmuebleForm?.value).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
        this.showModal(`Inmueble creado correctamente con el CUPS: ${this.oInmueble.cups}`);
      },
      error: (err) => {
        if (err.status === 400) {
          this.showModal('Datos inválidos. Revisa los campos.');
        } else if (err.status === 500) {
          this.showModal('Error interno del servidor. Inténtalo más tarde.');
        } else {
          this.showModal('Error desconocido. Consulta con el administrador.');
        }
        console.error(err);
      },
    });
  }
  




}
