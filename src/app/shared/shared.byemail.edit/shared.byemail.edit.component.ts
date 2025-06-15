import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
    MatButtonModule,
  RouterLink],
  standalone: true
})
export class SharedByemailEditComponent implements OnInit {
  email: string = '';
  oPerfilForm: FormGroup = new FormGroup({});
  strMessage: string = '';
  showSuccess: boolean = false;
  oSocio: ISocio | null = null;
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

  onReset() {
    this.oSocioService.getSocioByEmail(this.email).subscribe({
      next: (oSocio: ISocio) => {
        this.oSocio= oSocio;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oPerfilForm?.controls['id'].setValue(this.oSocio?.id);
    this.oPerfilForm?.controls['nombre'].setValue(this.oSocio?.nombre);
    this.oPerfilForm?.controls['apellido1'].setValue(this.oSocio?.apellido1);
    this.oPerfilForm?.controls['apellido2'].setValue(this.oSocio?.apellido2);
    this.oPerfilForm?.controls['email'].setValue(this.oSocio?.email);
    this.oPerfilForm?.controls['dni'].setValue(this.oSocio?.dni);
    this.oPerfilForm?.controls['telefono'].setValue(this.oSocio?.telefono)
    this.oPerfilForm?.controls['direccionfiscal'].setValue(this.oSocio?.direccionfiscal)
    this.oPerfilForm?.controls['codigopostal'].setValue(this.oSocio?.codigopostal)
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
