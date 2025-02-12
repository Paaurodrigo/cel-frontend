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
  ],
})
export class InmuebleClientCreateRoutedComponent implements OnInit {

  oInmuebleForm!: FormGroup; // ¡Sin inicializar aquí!
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
 
  constructor( private oInmuebleService: InmuebleService,
    private oRouter: Router,
    private fb: FormBuilder,
    private oSessionService: SessionService
  
  ) { }

    isSubmitting = false;


    ngOnInit() {
      this.createForm();
      
      // Obtener el ID del usuario logueado
      const userId = this.oSessionService.getSessionId;  // 🛠️ Asegúrate de que este método existe
      console.log('ID del usuario logueado:', userId); // Debug
    
      if (userId) {
        this.oInmuebleForm.get('socio.id')?.setValue(userId);
      }
    
      this.oInmuebleForm.markAllAsTouched();
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
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      refCatas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      potencia1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      potencia2: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      tension: [''],
      uso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]], 
      consumoAnual: ['', Validators.required],
      intencion: ['', Validators.required],
      habitos: ['', Validators.required],
      socio: this.fb.group({
        id: ['', Validators.required],  // Se rellenará automáticamente
      }),
    });
  }
  
  
  // Modal con MatDialog en lugar de bootstrap.Modal
  
  

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
  
    this.isSubmitting = true; // Bloquear el formulario mientras se procesa
  
    // Obtener el ID del socio desde el SessionService
    const socioId = this.oSessionService.getSessionId(); // Asegúrate de que este método exista en SessionService
    if (!socioId) {
      alert('No se pudo asignar el socio. Inicia sesión nuevamente.');
      this.isSubmitting = false;
      return;
    }
  
    // Asignar el ID del socio automáticamente
    this.oInmuebleForm.get('socio.id')?.setValue(socioId);
  
    // Llamada al servicio para crear el inmueble
    this.oInmuebleService.create(this.oInmuebleForm.value).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
        alert('Inmueble creado con éxito');
        this.oRouter.navigate(['/client/inmueble/plist']); // Redirige a la vista de cliente
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
        this.isSubmitting = false; // Rehabilitar el formulario cuando termine el proceso
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
      consumoAnual: 2500,
      intencion: 'Reducir consumo',
      habitos: 'Uso moderado'
    });
  }


}


