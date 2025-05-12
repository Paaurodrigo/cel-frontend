import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SessionService } from '../../../service/session.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

declare let bootstrap: any;

@Component({
  selector: 'app-inmueble.client.create.routed',
  templateUrl: './inmueble.client.create.routed.component.html',
  styleUrls: ['./inmueble.client.create.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
})
export class InmuebleClientCreateRoutedComponent implements OnInit {
  oInmuebleForm!: FormGroup;
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  cupsValido: boolean | null = null;
  private cupsSubject: Subject<string> = new Subject<string>();
  isSubmitting = false;
  direccionSubject: Subject<string> = new Subject<string>();
  sugerencias: any[] = [];
  formProgress: number = 0;

  constructor(
    private oInmuebleService: InmuebleService,
    private oRouter: Router,
    private fb: FormBuilder,
    private oSessionService: SessionService
  ) {}

  ngOnInit() {
    this.createForm();
    this.oInmuebleForm.get('consumoAnual')?.valueChanges.subscribe(() => this.calcularRecomendacion());
this.oInmuebleForm.get('habitos')?.valueChanges.subscribe(() => this.calcularRecomendacion());

this.cupsSubject.pipe(debounceTime(1000)).subscribe(cups => {
  this.cupsValido = cups ? this.validarCUPS(cups) : null;
});
    const userId = this.oSessionService.getSessionId();
    if (userId) {
      this.oInmuebleForm.get('socio.id')?.setValue(userId);
    }
    this.oInmuebleForm.markAllAsTouched();

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

  showModal(mensaje: string): void {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  createForm() {
    this.oInmuebleForm = this.fb.group({
      cups: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      refCatas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      potencia1: ['', [Validators.required]],
      potencia2: ['', [Validators.required]],
      tension: [''],
      uso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      consumoAnual: ['', Validators.required],
      comercializadora: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      habitos: ['', Validators.required],
      recomendacion: [''],
      socio: this.fb.group({
        id: ['', Validators.required],
      }),
    });
  }

  onCupsChange(): void {
    const cups = this.oInmuebleForm.get('cups')?.value;
    this.cupsSubject.next(cups);
  }

  calcularRecomendacion() {
    const consumo = Number(this.oInmuebleForm.get('consumoAnual')?.value);
    const habitosStr = this.oInmuebleForm.get('habitos')?.value;
    const porcentaje = habitosStr ? parseFloat(habitosStr.replace('%', '')) / 100 : 0;
    if (!consumo || !porcentaje) {
      this.oInmuebleForm.get('recomendacion')?.setValue('', { emitEvent: false });
      return;
    }
    const resultado = (consumo * porcentaje) / 1450;
    this.oInmuebleForm.get('recomendacion')?.setValue(resultado.toFixed(2), { emitEvent: false });
  }

  hideModal(): void {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/inmueble/plist']);
  }

  onReset(): void {
    this.oInmuebleForm?.reset();
  }

  onSubmit() {
    if (this.oInmuebleForm?.invalid) {
      alert('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.calcularRecomendacion();

    const socioId = this.oSessionService.getSessionId();
    if (!socioId) {
      alert('No se pudo asignar el socio. Inicia sesión nuevamente.');
      this.isSubmitting = false;
      return;
    }
    const formData = this.oInmuebleForm.value;
    const direccionCompleta = [
      formData.direccion,
      formData.portal && `${formData.portal}`
    ].filter(Boolean).join(', ');
    formData.direccion = direccionCompleta;

    this.oInmuebleForm.get('socio.id')?.setValue(socioId);

    this.oInmuebleService.create(this.oInmuebleForm.value).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
        alert('Inmueble creado con éxito');
        this.oRouter.navigate(['/client/inmueble/plist']);
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
            apellido1: result.apellido1,
          });
        } else {
          console.error('El socio no tiene id, nombre o apellido1:', result);
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
      consumoAnual: 2500,
      intencion: '50',
      habitos: '60%'
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

  validarCUPS(cups: string): boolean {
    const cupsRegex = /^ES(\d{16})([A-Z]{2})$/;
    const match = cups.match(cupsRegex);
    if (!match) return false;

    const numbers = match[1];
    const lettersInput = match[2];
    const lettersTable = 'TRWAGMYFPDXBNJZSQVHLCKE'.split('');
    const mod = BigInt(numbers) % 529n;
    const controlLetters = lettersTable[Number(mod / 23n)] + lettersTable[Number(mod % 23n)];
    return controlLetters === lettersInput;
  }
}
