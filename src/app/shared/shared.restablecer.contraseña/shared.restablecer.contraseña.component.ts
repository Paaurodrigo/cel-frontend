import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../service/login.service';
import { CryptoService } from '../../service/crypto.service';

@Component({
  selector: 'app-shared-restablecer-contraseña',
  templateUrl: './shared.restablecer.contraseña.component.html',
  styleUrls: ['./shared.restablecer.contraseña.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class SharedRestablecerContraseñaComponent implements OnInit {
  form!: FormGroup;
  idSocio!: number;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
    private oCryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.idSocio = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      dni: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // Limpia mensajes anteriores antes de validar
    this.errorMessage = null;
    this.successMessage = null;
  
    if (this.form.invalid) {
      this.errorMessage = 'Rellena todos los campos correctamente.';
      return;
    }
  
    const { dni, password, confirmPassword } = this.form.value;
  
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
  
    const hashedPassword = this.oCryptoService.getHashSHA256(password);
  
    this.loginService.restablecerPasswordConDni(this.idSocio, dni, hashedPassword).subscribe({
      next: () => {
        this.successMessage = 'Contraseña cambiada correctamente.';
        this.errorMessage = null;
      
      },
      error: () => {
        this.errorMessage = 'DNI incorrecto o error al restablecer la contraseña.';
        this.successMessage = null;
      },
    });
  }
  
}
