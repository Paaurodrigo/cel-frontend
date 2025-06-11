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

import { Component, inject, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'; 

declare let bootstrap: any;

@Component({
  selector: 'app-inmueble.admin.create.routed',
  templateUrl: './inmueble.admin.create.routed.component.html',
  styleUrls: ['./inmueble.admin.create.routed.component.css'],
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
export class InmuebleAdminCreateRoutedComponent implements OnInit {
  oInmuebleForm!: FormGroup;
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);

  isSubmitting = false;
  formProgress: number = 0;
  // ✅ Añadimos estado para el CUPS
  cupsValido: boolean | null = null;
  private cupsSubject: Subject<string> = new Subject<string>();
  direccionSubject: Subject<string> = new Subject<string>();
  sugerencias: any[] = [];

  constructor(
    private oInmuebleService: InmuebleService,
    private oRouter: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
    this.oInmuebleForm?.markAllAsTouched();

    // ✅ Configuramos el debounce para validar CUPS
    this.cupsSubject.pipe(
      debounceTime(1000) // 2 segundos de espera tras la última tecla
    ).subscribe(cups => {
      if (!cups) {
        this.cupsValido = null; // Sin estado si está vacío
      } else {
        this.cupsValido = this.validarCUPS(cups);
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
        
  }

  createForm() {
    this.oInmuebleForm = this.fb.group({
      cups: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      refCatas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      potencia1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      potencia2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      tension: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      uso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      consumoAnual: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      habitos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      socio: this.fb.group({
        id: ['', Validators.required],
        nombre: [''],
        apellido1: ['']
      }),
      comercializadora:['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      portal: [''],
     puerta: [''],
    });

    this.oInmuebleForm.get('habitos')?.valueChanges.subscribe(() => this.calcularRecomendacion());
  }



  onCupsChange(): void {
    const cups = this.oInmuebleForm.get('cups')?.value;
    this.cupsSubject.next(cups);
  }

  // ✅ Validador de CUPS
  validarCUPS(cups: string): boolean {
    const cupsRegex = /^ES(\d{16})([A-Z]{2})$/;
    const match = cups.match(cupsRegex);
  
    if (!match) return false;
  
    const numbers = match[1];
    const lettersInput = match[2];
    
    const lettersTable = [
      'T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D',
      'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L',
      'C', 'K', 'E'
    ];
  
    const mod = BigInt(numbers) % 529n;
    const firstLetterIndex = Number(mod / 23n);
    const secondLetterIndex = Number(mod % 23n);
  
    const controlLetters = lettersTable[firstLetterIndex] + lettersTable[secondLetterIndex];
  
    return controlLetters === lettersInput;
  }
  calcularRecomendacion() {
    const consumo = Number(this.oInmuebleForm.get('consumoAnual')?.value);
    const intencion = Number(this.oInmuebleForm.get('intencion')?.value);
  
    if (!consumo || !intencion || intencion === 0) {
      this.oInmuebleForm.get('recomendacion')?.setValue('', { emitEvent: false });
      return;
    }
  
    const resultado = consumo / intencion;
    this.oInmuebleForm.get('recomendacion')?.setValue(resultado.toFixed(2), { emitEvent: false });
  }
  
  

  showModal(mensaje: string): void {
    this.strMessage = mensaje;
    const dialogRef = this.dialog.open(SocioselectorComponent, {
      width: '300px',
      data: { message: this.strMessage },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('El modal se cerró', result);
      }
    });
  }

  hideModal(): void {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/inmueble/plist']);
  }

  onReset(): void {
    this.oInmuebleForm?.reset();
  }

  onSubmit() {
    if (this.oInmuebleForm?.invalid || this.cupsValido !== true) {
      alert('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    if (this.isSubmitting) {
      return;
    }
  
    this.isSubmitting = true;
    const formData = this.oInmuebleForm.value;
  
    // Calculamos porcentaje y recomendación
    const porcentaje = parseFloat(formData.habitos.replace('%', '')) / 100;
    formData.recomendacion = (formData.consumoAnual * porcentaje) / 1450;
  
    // Concatenar portal y puerta a la dirección
    const direccionCompleta = [
      formData.direccion,
      formData.portal && `${formData.portal}`
    ].filter(Boolean).join(', ');
    formData.direccion = direccionCompleta;
  
    // Enviar al servicio
    this.oInmuebleService.create(formData).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
        alert('Inmueble creado con éxito');
        this.oRouter.navigate(['/admin/inmueble/plist']);
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
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
  

  showSocioSelectorModal() {
    const dialogRef = this.dialog.open(SocioselectorComponent, {
      height: '400px',
      maxHeight: '500px',
      width: '80%',
      maxWidth: '90%',
      data: { origen: '', idBalance: '' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.id && result.nombre && result.apellido1) {
          this.oInmuebleForm.get('socio')?.setValue({
            id: result.id,
            nombre: result.nombre,
            apellido1: result.apellido1
          });
        } else {
          console.error("El socio no tiene id, nombre o apellido1:", result);
        }
      }
    });

    return false;
  }

  rellenarFormulario() {
    this.oInmuebleForm.patchValue({
      cups: 'ES1234567890123456',
      direccion: 'Calle Falsa 123',
      codigoPostal: 46001,
      municipio: 'Valencia',
      refCatas: '123456789ABC',
      potencia1: 3,
      potencia2: 4,
      tension: 230,
      uso: 'Residencial',
      recomendacion: 'Ahorro energético',
      consumoAnual: 2500,
      intencion: 'Reducir consumo',
      habitos: 'Uso moderado'
    });
  }

  onSearchDireccion(): void {
    const direccion = this.oInmuebleForm.get('direccion')?.value;
    this.direccionSubject.next(direccion);
  }

  seleccionarDireccion(sugerencia: any): void {
    const props = sugerencia.properties;
  
    const direccionCompleta = [
      props.name,
     
    ].filter(Boolean).join(', '); // Filtra null/undefined
  
    this.oInmuebleForm.patchValue({
      direccion: direccionCompleta,
      codigoPostal: props.postcode || '',
      municipio: props.city || ''
    });
  
    this.sugerencias = [];
  }
  
}
