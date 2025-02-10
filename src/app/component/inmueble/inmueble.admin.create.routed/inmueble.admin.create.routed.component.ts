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

import { Component, inject, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';
import { MatDialog } from '@angular/material/dialog';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-inmueble.admin.create.routed',
  templateUrl: './inmueble.admin.create.routed.component.html',
  styleUrls: ['./inmueble.admin.create.routed.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
   
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
      recomendacion: ['', Validators.required],  // Asegúrate de tener estos campos
      consumoanual: ['', Validators.required],
      intencion: ['', Validators.required],
      habitos: ['', Validators.required],
      socio: this.fb.group({
        nombre: [''], 
        apellido1: ['']
      })
    });
  }
  
  
  
  // Modal con MatDialog en lugar de bootstrap.Modal
showModal(mensaje: string): void {
  this.strMessage = mensaje;
  const dialogRef = this.dialog.open(SocioselectorComponent, { // Cambia por tu componente modal
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
    if (this.oInmuebleForm?.invalid) {
      this.myModal('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    this.oInmuebleService.create(this.oInmuebleForm?.value).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
        this.myModal(`Inmueble creado correctamente con el CUPS: ${this.oInmueble.cups}`);
      },
      error: (err) => {
        if (err.status === 400) {
          this.myModal('Datos inválidos. Revisa los campos.');
        } else if (err.status === 500) {
          this.myModal('Error interno del servidor. Inténtalo más tarde.');
        } else {
          this.myModal('Error desconocido. Consulta con el administrador.');
        }
        console.error(err);
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
        console.log("Socio seleccionado antes de asignarlo al formulario:", result);
    
        if (result.nombre && result.apellido1) { // ⚠️ Asegurar que hay valores
          this.oInmuebleForm.get('socio')?.setValue({
            nombre: result.nombre || '',
            apellido1: result.apellido1 || ''
          });
          
    
          console.log("Formulario actualizado:", this.oInmuebleForm.value);
        } else {
          console.error("El socio no tiene nombre o apellido1:", result);
        }
      }
    });
    
    return false;
  }



}
