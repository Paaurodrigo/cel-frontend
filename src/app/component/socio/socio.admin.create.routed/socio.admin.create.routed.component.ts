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
import { Component, inject, OnInit } from '@angular/core';
import { CryptoService } from '../../../service/crypto.service';
import { TiposocioselectorComponent } from '../../tiposocio/tiposocioselector/tiposocioselector.component';
import { MatDialog } from '@angular/material/dialog';
import { ITipoSocio } from '../../../model/tipoSocio.interface';

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
  dniValido: boolean | null = null; // Estado del DNI
  fotoDni: File | null = null;
  resultado: boolean | null = null; // Resultado de la comprobación
  readonly dialog = inject(MatDialog);
  oTipoSocio: ITipoSocio = {} as ITipoSocio;
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
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]], // Ejemplo de validación de DNI
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      fotoDni: [null],  // Campo para la foto del DNI
      direccionfiscal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigopostal: [''],
    
  tipoSocio: this.fb.group({
    id: [null, Validators.required],
    descripcion:[null, Validators.required],
    socios:[null, Validators.required],
  })
    });
  }

  ngOnInit(): void {}

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
    this.oSocioForm.reset(); // Usa el método reset de Angular
  }

 

  onSubmit(): void {
    if (this.oSocioForm.invalid) {
      this.showModal('Formulario inválido. Revisa los campos e inténtalo de nuevo.');
      return;
    }
    const contraseña = this.oSocioForm.get('contraseña')?.value || ''; // Asegura que sea un string
    const hashedcontraseña = this.oCryptoService.getHashSHA256(contraseña);
    
    
    const formData = new FormData();
    formData.append('nombre', this.oSocioForm.get('nombre')?.value);
    formData.append('apellido1', this.oSocioForm.get('apellido1')?.value);
    formData.append('apellido2', this.oSocioForm.get('apellido2')?.value);
    formData.append('email', this.oSocioForm.get('email')?.value);
    formData.append('password', hashedcontraseña);
    formData.append('telefono', this.oSocioForm.get('telefono')?.value);
    formData.append('dni', this.oSocioForm.get('dni')?.value);
    formData.append('fotoDni', this.fotoDni!);  // Aquí añadimos el archivo
    formData.append('direccionfiscal', this.oSocioForm.get('direccionfiscal')?.value);
    formData.append('codigopostal', this.oSocioForm.get('codigopostal')?.value);
    formData.append('tiposocio', this.oSocioForm.get('tipoSocio')?.value.id);

    this.oSocioService.createbyAdmin(formData).subscribe({
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

 // Función para validar el DNI
 comprobarDni(): void {
  const dni = this.oSocioForm.get('dni')?.value;

  if (!dni) {
    this.dniValido = false;
    return;
  }

  this.dniValido = this.esDniValido(dni);
}

// Función para validar el DNI
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

// Manejar cambios en el campo DNI
onDniChange(): void {
  this.dniValido = null; // Reinicia el estado al modificar el DNI
}

showTipoSocioSelectorModal() {
  const dialogRef = this.dialog.open(TiposocioselectorComponent, {
    height: '400px',
    maxHeight: '500px',
    width: '80%',
    maxWidth: '90%',
    data: { origen: '', idBalance: '' },


  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    if (result !== undefined) {
      console.log(result);
      this.oSocioForm?.controls['tipoSocio'].setValue({
        id: result.id,
        descripcion: result.descripcion,
        socios:result.socios,
      });
    }
  });
  return false;
}

 datosEjemplo = {
  nombre: 'Juan',
  apellido1: 'Pérez',
  apellido2: 'García',
  email: 'juan.perez@example.com',
  contraseña: 'contraseñaSegura',
  dni: '54013411G',
  telefono: '600123456',
  direccionfiscal: 'Calle Falsa 123',
  codigopostal: '46001',
  tipoSocio: 1,
   
  
};

rellenarFormulario(): void {
  this.oSocioForm.patchValue(this.datosEjemplo);
}





}
