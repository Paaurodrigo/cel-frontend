import { Router, RouterModule } from '@angular/router';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormControl,
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
    CommonModule
  ],

 
  
})
export class InmuebleAdminCreateRoutedComponent implements OnInit {
  oInmuebleForm!: FormGroup; // ¡Sin inicializar aquí!
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  constructor( private oInmuebleService: InmuebleService,
    private oRouter: Router,
    private fb: FormBuilder) { }

    isSubmitting = false;
  ngOnInit() {
   this.createForm();
    this.oInmuebleForm?.markAllAsTouched();
  }
  
  createForm() {
    this.oInmuebleForm = this.fb.group({
      cups: ['', [Validators.minLength(3), Validators.maxLength(50)]], 
      direccion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      codigoPostal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      refCatas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      potencia1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      potencia2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      tension: [''],
      uso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      recomendacion: ['', Validators.required], 
      consumoAnual: ['', Validators.required],
      intencion: ['', Validators.required],
      habitos: ['', Validators.required],
      socio: this.fb.group({
        id: ['', Validators.required],  // Asegúrate de que `id` esté presente
        nombre: [''], 
        apellido1: ['']
      })
    });
  }
  
  
  // Modal con MatDialog en lugar de bootstrap.Modal
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
    this.oInmuebleForm?.reset(); // Usa el método reset de Angular
  }


 
  
    onSubmit() {
      // Si el formulario es inválido, no enviamos nada
      if (this.oInmuebleForm?.invalid) {
        alert('Formulario inválido. Por favor, revisa los campos marcados.');
        return;
      }
  
      // Evitar múltiples envíos
      if (this.isSubmitting) {
        return;
      }
  
      this.isSubmitting = true;  // Bloquear el formulario mientras se procesa
  
      // Llamada al servicio para crear el inmueble
      this.oInmuebleService.create(this.oInmuebleForm?.value).subscribe({
        next: (oInmueble: IInmueble) => {
          this.oInmueble = oInmueble;
          alert('Inmueble creado con éxito');
          this.oRouter.navigate(['/admin/inmueble/plist']);
        },
        error: (err) => {
          // Mostrar diferentes mensajes según el tipo de error
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
          this.isSubmitting = false;  // Rehabilitar el formulario cuando termine el proceso
        },
      });
    }
  


/*  
  onSubmit() {

    if (this.oInmuebleForm?.invalid) {
     
      alert('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    this.oInmuebleService.create(this.oInmuebleForm?.value).subscribe({
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
    });
  }
  */
  
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
        console.log("Socio seleccionado antes de asignarlo al formulario:", result);
    
        if (result.id && result.nombre && result.apellido1) {
          // Asigna todos los campos requeridos al 'socio'
          this.oInmuebleForm.get('socio')?.setValue({
            id: result.id,
            nombre: result.nombre,
            apellido1: result.apellido1
          });
          console.log("Formulario actualizado:", this.oInmuebleForm.value);
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


}


