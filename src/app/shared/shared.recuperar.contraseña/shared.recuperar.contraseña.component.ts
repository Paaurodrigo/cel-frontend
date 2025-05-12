import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-shared.recuperar.contraseña',
  templateUrl: './shared.recuperar.contraseña.component.html',
  styleUrls: ['./shared.recuperar.contraseña.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class SharedRecuperarContraseñaComponent{
  form: FormGroup;
  mensaje: string | null = null;
  error: string | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = new FormGroup({
      identificador: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    const value = this.form.get('identificador')?.value;
    this.loginService.solicitarRecuperacionPassword(value).subscribe({
      next: () => {
        this.mensaje = 'Te hemos enviado un correo con instrucciones si el usuario existe.';
        this.error = null;
      },
      error: () => {
        this.error = 'No se ha podido procesar la solicitud. Inténtalo más tarde.';
        this.mensaje = null;
      }
    });
  }
}