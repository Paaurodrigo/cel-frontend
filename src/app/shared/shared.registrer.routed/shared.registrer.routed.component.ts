import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ISocio } from '../../model/socio.interface';
import { CryptoService } from '../../service/crypto.service';
import { SocioService } from '../../service/socio.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';

declare let bootstrap: any;

@Component({
  selector: 'app-shared.registrer.routed',
  templateUrl: './shared.registrer.routed.component.html',
  styleUrls: ['./shared.registrer.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
})
export class SharedRegistrerRoutedComponent implements OnInit {
  oSocioForm: FormGroup;
  oSocio: ISocio | null = null;
  strMessage: string = '';
  myModal: any;
  dniValido: boolean | null = null; // Estado del DNI
  fotoDni: File | null = null;
  resultado: boolean | null = null; // Resultado de la comprobación
  emailExiste: boolean = false;
  dniExiste: boolean = false;
  emailSubject: Subject<string> = new Subject<string>();

  // ✅ Añadimos Subject para debounce del DNI
  dniSubject: Subject<string> = new Subject<string>();

  constructor(
    private oSocioService: SocioService,
    private oRouter: Router,
    private fb: FormBuilder,
    private oCryptoService: CryptoService
  ) {
    // Inicialización del formulario
    this.oSocioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido2: [''],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(4)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      fotoDni: [null], // Campo para la foto del DNI
      direccionfiscal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigopostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    });
  }

  ngOnInit(): void {
    // Debounce para el campo DNI + validación letra DNI + check si existe en backend
    this.dniSubject.pipe(
      debounceTime(1000)
    ).subscribe(dni => {
      if (!dni) {
        this.dniValido = false;
        this.dniExiste = false;
      } else {
        this.dniValido = this.esDniValido(dni);
        if (this.dniValido) {
          this.checkDniExists(dni);
        } else {
          this.dniExiste = false; // No hacer check si DNI formato incorrecto
        }
      }
    });
  
    // Debounce para el campo Email + check si existe en backend
    this.emailSubject.pipe(debounceTime(1000)).subscribe(email => {
      if (!email) {
        this.emailExiste = false;
      } else {
        this.checkEmailExists(email);
      }
    });
  }
  
  // Método para llamar al servicio y actualizar dniExiste
  private checkDniExists(dni: string): void {
    this.oSocioService.checkDniExists(dni).subscribe({
      next: (existe: boolean) => {
        this.dniExiste = existe;
      },
      error: (err) => {
        console.error('Error checking DNI existence', err);
        this.dniExiste = false;
      }
    });
  }
  
  // Método para llamar al servicio y actualizar emailExiste
  private checkEmailExists(email: string): void {
    this.oSocioService.checkEmailExists(email).subscribe({
      next: (existe: boolean) => {
        this.emailExiste = existe;
      },
      error: (err) => {
        console.error('Error checking email existence', err);
        this.emailExiste = false;
      }
    });
  }
  

  onFileSelect(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoDni = file;
    }
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
    this.oRouter.navigate(['/admin/socio/plist']);
  }

  onReset(): void {
    this.oSocioForm.reset();
  }

 
  

  onSubmit(): void {
    if (this.oSocioForm.invalid) {
      this.showModal('Formulario inválido. Revisa los campos e inténtalo de nuevo.');
      return;
    }
  
    console.log(this.emailExiste);
    if (this.emailExiste) {
      this.showModal('No se puede registrar porque el email ya existe.');
      return;
    }
  
    if (this.dniExiste) {
      this.showModal('No se puede registrar porque el DNI ya existe.');
      return;
    }

    const contraseña = this.oSocioForm.get('contraseña')?.value || '';
    const hashedcontraseña = this.oCryptoService.getHashSHA256(contraseña);

    const formData = new FormData();
    formData.append('nombre', this.oSocioForm.get('nombre')?.value);
    formData.append('apellido1', this.oSocioForm.get('apellido1')?.value);
    formData.append('apellido2', this.oSocioForm.get('apellido2')?.value);
    formData.append('email', this.oSocioForm.get('email')?.value);
    formData.append('password', hashedcontraseña);
    formData.append('telefono', this.oSocioForm.get('telefono')?.value);
    formData.append('dni', this.oSocioForm.get('dni')?.value);
    formData.append('fotoDni', this.fotoDni!); // Archivo del DNI
    formData.append('direccionfiscal', this.oSocioForm.get('direccionfiscal')?.value);
    formData.append('codigopostal', this.oSocioForm.get('codigopostal')?.value);
    formData.append('tiposocio', '2'); // ID del tipo de socio "Miembro"

    this.oSocioService.create(formData).subscribe({
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

  // ✅ Función de validación del DNI
  private esDniValido(dni: string): boolean {
    const dniRegex = /^[0-9]{8}[A-Z]$/;

    if (!dniRegex.test(dni)) {
      return false;
    }

    const numero = parseInt(dni.slice(0, 8), 10);
    const letra = dni[8];
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const letraCorrecta = letras[numero % 23];

    return letra === letraCorrecta;
  }

  // ✅ Cada vez que el usuario escribe en el campo DNI, se emite al Subject
  onDniChange(): void {
    const dni = this.oSocioForm.get('dni')?.value;
    this.dniSubject.next(dni);
  }
  onEmailChange(): void {
    const email = this.oSocioForm.get('email')?.value;
    this.emailSubject.next(email);
  }
  

}
