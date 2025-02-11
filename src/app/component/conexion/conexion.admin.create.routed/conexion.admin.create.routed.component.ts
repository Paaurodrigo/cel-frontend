import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IConexion } from '../../../model/conexion.interface';
import { ConexionService } from '../../../service/conexion.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';
import { IInstalacion } from '../../../model/instalacion.interface';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleselectorComponent } from '../../inmueble/inmueble.selector/inmuebleselector.component';

@Component({
  selector: 'app-conexion.admin.create.routed',
  templateUrl: './conexion.admin.create.routed.component.html',
  styleUrls: ['./conexion.admin.create.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule,ReactiveFormsModule],
})
export class ConexionAdminCreateRoutedComponent implements OnInit {
 oInstalacion: IInstalacion = {} as IInstalacion;
 oInmueble: IInmueble = {} as IInmueble;
    oConexionForm!: FormGroup; // Formulario reactivo
    oConexion: IConexion | null = null;
    strMessage: string = '';
    myModal: any;
    readonly dialog = inject(MatDialog);
  
    constructor(
      private oConexionService: ConexionService,
      private oRouter: Router,
      private fb: FormBuilder,
      
    ) {}
  
    ngOnInit(): void {
      this.createForm();
      this.oConexionForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores si existen
     
    }

    
  
    // Crear el formulario reactivo
    createForm(): void {
      this.oConexionForm = this.fb.group({
        potencia: ['', [Validators.required, Validators.min(0)]], // Potencia debe ser un número positivo
        fecha: ['', [Validators.required]], // Fecha es obligatoria
        porcentaje: ['', [Validators.required, Validators.min(0), Validators.max(100)]], // Porcentaje entre 0 y 100
        instalacion: this.fb.group({
          id: ['', Validators.required],  
          nombre: ['',Validators.required]
        }),
        inmueble: this.fb.group({
          id: ['', Validators.required],  // Asegúrate de que `id` esté presente
          cups: [''], 
          direccion: ['']
        })
      });
    }


   








  
    // Resetear el formulario
    onReset(): void {
      this.oConexionForm.reset();
    }
  
    // Mostrar un modal con un mensaje
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

    showInmueblesSelectorModal() {
      const dialogRef = this.dialog.open(InmuebleselectorComponent, {
        height: '500px',
        maxHeight: '800px',
        width: '80%',
        maxWidth: '90%',
        
  
  
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result !== undefined) {
          console.log(result);
          this.oConexionForm?.controls['conexion'].setValue({
            id: result.id,
            titulo: result.titulo,
            descripcion: result.descripcion,
          });
        }
      });
      return false;
    }
  


    // Enviar el formulario
    onSubmit(): void {
      if (this.oConexionForm.invalid) {
        alert('Formulario inválido. Por favor, revisa los campos marcados.');
        return;
      }
  
      this.oConexionService.create(this.oConexionForm.value).subscribe({
        next: (oConexion: IConexion) => {
          this.oConexion = oConexion;
          alert('Conexión creada con éxito');
          this.oRouter.navigate(['/admin/conexion/plist']);
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
  }