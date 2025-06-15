import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ISocio } from '../../model/socio.interface';
import { SocioService } from '../../service/socio.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-shared.byemail.edit',
  templateUrl: './shared.byemail.edit.component.html',
  styleUrls: ['./shared.byemail.edit.component.css'],
  imports: [ CommonModule,             
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  standalone: true
})
export class SharedByemailEditComponent implements OnInit {
  email: string = '';
  oPerfilForm: FormGroup = new FormGroup({});
  strMessage: string = '';
  showSuccess: boolean = false;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oSocioService: SocioService
  ) {}

  ngOnInit(): void {
    this.email = this.oActivatedRoute.snapshot.params['email'];
    this.createForm();
    this.cargarPerfil();
  }

  createForm(): void {
    this.oPerfilForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido1: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido2: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      direccionfiscal: new FormControl('', [Validators.required]),
      codigopostal: new FormControl('', [Validators.required]),
    });
  }

  cargarPerfil(): void {
    this.oSocioService.getSocioByEmail(this.email).subscribe({
      next: (socio) => {
        this.oPerfilForm.patchValue(socio);
      },
      error: () => {
        this.strMessage = 'Error al cargar el perfil';
        this.showSuccess = false;
      }
    });
  }

  onSubmit(): void {
    if (this.oPerfilForm.invalid) {
      this.strMessage = 'Formulario no válido';
      this.showSuccess = false;
      return;
    }

    const formData = this.oPerfilForm.getRawValue(); // para incluir id deshabilitado
    this.oSocioService.update(formData).subscribe({
      next: () => {
        this.strMessage = 'Perfil actualizado correctamente';
        this.showSuccess = true;
      },
      error: () => {
        this.strMessage = 'Error al actualizar el perfil';
        this.showSuccess = false;
      }
    });
  }
}
