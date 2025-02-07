import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

declare let bootstrap: any;
@Component({
  selector: 'app-instalacion.admin.create.routed',
  templateUrl: './instalacion.admin.create.routed.component.html',
  styleUrls: ['./instalacion.admin.create.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class InstalacionAdminCreateRoutedComponent implements OnInit {
  oInstalacionForm: FormGroup | undefined = undefined;
  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';
  myModal: any;
  constructor( private oInstalacionService: InstalacionService,
    private oRouter: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.oInstalacionForm?.markAllAsTouched();
  }

  createForm() {
    this.oInstalacionForm = this.fb.group({
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
    this.oRouter.navigate(['/admin/instalacion/plist']);
  }

  onReset(): void {
    this.oInstalacionForm?.reset(); // Usa el método reset de Angular
  }
  onSubmit() {
    if (this.oInstalacionForm?.invalid) {
      this.showModal('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    this.oInstalacionService.create(this.oInstalacionForm?.value).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
        this.showModal(`Instalacion creado correctamente con el nombre: ${this.oInstalacion.nombre}`);
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
