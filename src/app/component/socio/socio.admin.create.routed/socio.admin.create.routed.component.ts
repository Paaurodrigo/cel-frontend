import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
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
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
    CommonModule,
    MatIconModule
  ],
})
export class SocioAdminCreateRoutedComponent implements OnInit {
  oSocioForm: FormGroup;
  oSocio: ISocio | null = null;
  strMessage: string = '';
  myModal: any;
  dniValido: boolean | null = null;
  fotoDni: File | null = null;
  resultado: boolean | null = null;
  readonly dialog = inject(MatDialog);
  oTipoSocio: ITipoSocio = {} as ITipoSocio;
  emailExiste: boolean = false;
  dniExiste: boolean = false;
  emailSubject: Subject<string> = new Subject<string>();
  // ✅ Añadimos Subject para debounce del DNI
  dniSubject: Subject<string> = new Subject<string>();
  direccionSubject: Subject<string> = new Subject<string>();
  sugerencias: any[] = [];
  hidePassword: boolean = true;
  esExito: boolean = false;
  constructor(
    private oSocioService: SocioService,
    private oRouter: Router,
    private fb: FormBuilder,
    private oCryptoService: CryptoService
  ) {
    this.oSocioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      apellido2: [''],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(4)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Z]$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      fotoDni: [null],
      direccionfiscal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigopostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      numero: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccionBase: [''], // ← no se guarda, solo interna
      tipoSocio: this.fb.group({
        id: [2, Validators.required], // id por defecto 2
        descripcion: ['miembro', Validators.required], // descripción por defecto "Miembro"
        socios: [null] // lo dejamos en null, salvo que quieras meter algo
      })      
    });
  }

  ngOnInit(): void {
    this.dniSubject.pipe(
      debounceTime(100)
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

    // ✅ Photon API con debounce
            this.direccionSubject.pipe(
              debounceTime(400),
              distinctUntilChanged()
            ).subscribe(direccion => {
              if (!direccion || direccion.length < 3) {
                this.sugerencias = [];
                return;
              }
        
              fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(direccion)}&limit=5&bbox=-1.75,37.8,0.75,40.9`)
          .then(res => res.json())
          .then(data => {
            this.sugerencias = data.features;
          })
          .catch(err => {
            console.error('Error al buscar direcciones:', err);
            this.sugerencias = [];
          });
            });
  
    // Debounce para el campo Email + check si existe en backend
    this.emailSubject.pipe(debounceTime(1000)).subscribe(email => {
      if (!email) {
        this.emailExiste = false;
      } else {
        this.checkEmailExists(email);
      }
    });
    this.oSocioForm.get('numero')?.valueChanges.subscribe(() => {
      this.actualizarDireccionCompleta();
    });
    
    
  }

  onFileSelect(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoDni = file;
    }
  }

  actualizarDireccionCompleta(): void {
    const numero = this.oSocioForm.get('numero')?.value || '';
    const direccionBase = this.oSocioForm.get('direccionBase')?.value || '';
  
    if (direccionBase) {
      const partes: string[] = direccionBase.split(',');
      const nombreCalle = partes[0]?.trim();
      const resto = partes.slice(1).map((p: string) => p.trim()).join(', ');
  
      const direccionFinal = numero
        ? `${nombreCalle}, ${numero}, ${resto}`
        : direccionBase;
  
      this.oSocioForm.patchValue({ direccion: direccionFinal });
    }
  }
  


  // Método para llamar al servicio y actualizar dniExiste
  private checkDniExists(dni: string): void {
    this.oSocioService.checkDniExists(dni).subscribe({
      next: (existe: boolean) => {
        this.dniExiste = existe;
  
        // 🔥 Fuerza que se muestre el mensaje en el HTML
        this.oSocioForm.get('dni')?.markAsTouched();
        this.oSocioForm.get('dni')?.updateValueAndValidity();
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
        console.log('¿EMAIL existe?', existe);
        this.emailExiste = existe;
  
        // 🔥 Fuerza visualización del error si ya existe
        this.oSocioForm.get('email')?.markAsTouched();
        this.oSocioForm.get('email')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error checking email existence', err);
        this.emailExiste = false;
      }
    });
  }

  onEmailChange(): void {
    const email = this.oSocioForm.get('email')?.value;
    this.emailSubject.next(email);
  }
  
  

  showModal(mensaje: string, exito: boolean = false): void {
    this.strMessage = mensaje;
    this.esExito = exito;
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
    formData.append('fotoDni', this.fotoDni!);
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

  // ✅ Función de validación del DNI (la mantenemos)
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

  showTipoSocioSelectorModal() {
    const dialogRef = this.dialog.open(TiposocioselectorComponent, {
      height: '400px',
      maxHeight: '500px',
      width: '80%',
      maxWidth: '90%',
      data: { origen: '', idBalance: '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.oSocioForm?.controls['tipoSocio'].setValue({
          id: result.id,
          descripcion: result.descripcion,
          socios: result.socios,
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

  onSearchDireccion(): void {
    const direccion = this.oSocioForm.get('direccionfiscal')?.value;
    this.direccionSubject.next(direccion);
  }

  seleccionarDireccion(sugerencia: any): void {
    const direccionBase = [
      sugerencia.properties.name,
      sugerencia.properties.postcode,
      sugerencia.properties.city,
    ].filter(Boolean).join(', ');
  
    this.oSocioForm.patchValue({
      direccionBase: direccionBase
    });
  
    this.actualizarDireccionCompleta(); // ← aquí se aplica el número si lo hay
  
    this.sugerencias = []; // limpia la lista de sugerencias
  }
  
}
