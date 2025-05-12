import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Component, inject, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

declare let bootstrap: any;
// ... (importaciones sin cambios)
@Component({
  selector: 'app-inmueble.admin.create.byuser.routed',
  templateUrl: './inmueble.admin.create.byuser.routed.component.html',
  styleUrls: ['./inmueble.admin.create.byuser.routed.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,         // <-- Añádelo
   
  ],
  standalone: true
})
export class InmuebleAdminCreateByuserRoutedComponent implements OnInit {
  oInmuebleForm!: FormGroup;
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  isSubmitting = false;
  idSocio!: number;
  cupsValido: boolean | null = null;
  private cupsSubject: Subject<string> = new Subject<string>();
  direccionSubject: Subject<string> = new Subject<string>();
  sugerencias: any[] = [];
 
  formProgress: number = 0;

  

  constructor(
    private oInmuebleService: InmuebleService,
    private oRouter: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.idSocio = Number(this.route.snapshot.paramMap.get('id'));
    this.createForm();
    this.oInmuebleForm?.markAllAsTouched();

    this.cupsSubject.pipe(debounceTime(1000)).subscribe(cups => {
      this.cupsValido = cups ? this.validarCUPS(cups) : null;
    });

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
      cups: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      refCatas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      potencia1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      potencia2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      tension: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      uso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      consumoAnual: ['', [Validators.required]],
      habitos: ['', [Validators.required]],
      comercializadora: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      socio: this.fb.group({
        id: [this.idSocio!, Validators.required]
      }),
      portal: [''],
     puerta: [''],
    });
  }

  onCupsChange(): void {
    const cups = this.oInmuebleForm.get('cups')?.value;
    this.cupsSubject.next(cups);
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

  calcularRecomendacion(): number {
    const consumo = Number(this.oInmuebleForm.get('consumoAnual')?.value);
    const habitosStr = this.oInmuebleForm.get('habitos')?.value;
    const porcentaje = habitosStr ? parseFloat(habitosStr.replace('%', '')) / 100 : 0;

    if (!consumo || !porcentaje) return 0;

    const resultado = (consumo * porcentaje) / 1450;
    return parseFloat(resultado.toFixed(2));
  }

  showModal(mensaje: string): void {
    this.strMessage = mensaje;
    alert(this.strMessage);
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

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = this.oInmuebleForm.value;
    formData.recomendacion = this.calcularRecomendacion();

    const direccionCompleta = [
      formData.direccion,
      formData.portal && `${formData.portal}`
    ].filter(Boolean).join(', ');
    formData.direccion = direccionCompleta;

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
      }
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
