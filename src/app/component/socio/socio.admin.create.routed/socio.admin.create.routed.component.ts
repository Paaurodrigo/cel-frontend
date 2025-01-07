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
import { ISocio } from '../../../model/socio.interface';
import { SocioService } from '../../../service/socio.service';
import { Component, OnInit } from '@angular/core';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-socio-admin-create-routed',
  templateUrl: './socio.admin.create.routed.component.html',
  styleUrls: ['./socio.admin.create.routed.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class SocioAdminCreateRoutedComponent implements OnInit {
  oSocioForm: FormGroup;
  oSocio: ISocio | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oSocioService: SocioService,
    private oRouter: Router,
    private fb: FormBuilder
  ) {
    // Inicialización del formulario
    this.oSocioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido2: [''],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]], // Ejemplo de validación de DNI
      id_tipousuario: [''],
    });
  }

  ngOnInit(): void {}

  showModal(mensaje: string): void {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal(): void {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/socio/plist']);
  }

  onReset(): void {
    this.oSocioForm.reset(); // Usa el método reset de Angular
  }

  onSubmit(): void {
    if (this.oSocioForm.invalid) {
      this.showModal('Formulario inválido');
      return;
    }

    this.oSocioService.create(this.oSocioForm.value).subscribe({
      next: (oSocio: ISocio) => {
        this.oSocio = oSocio;
        this.showModal(`Socio creado con el id: ${this.oSocio.id}`);
      },
      error: (err) => {
        this.showModal('Error al crear el usuario');
        console.error(err);
      },
    });
  }
}
