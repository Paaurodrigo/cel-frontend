import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IConexion } from '../../../model/conexion.interface';
import { ConexionService } from '../../../service/conexion.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';

@Component({
  selector: 'app-conexion.admin.create.routed',
  templateUrl: './conexion.admin.create.routed.component.html',
  styleUrls: ['./conexion.admin.create.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ConexionAdminCreateRoutedComponent implements OnInit {
  oConexionForm!: FormGroup; // ¡Sin inicializar aquí!
  oConexion: IConexion | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  constructor( private oConexionService: ConexionService,
    private oRouter: Router,
    private fb: FormBuilder) { }

    ngOnInit() {
      this.createForm();
       this.oConexionForm?.markAllAsTouched();
     }

     createForm() {
      this.oConexionForm = this.fb.group({
        potencia: ['', [Validators.minLength(3), Validators.maxLength(50)]], 
        fecha: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        porcentaje: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
        inmueble: this.fb.group({
          cups: [''], 
          direccion: ['']
        }),
        instalacion: this.fb.group({
          id: [''], 
          nombre: ['']
        })
      });
    }

    onReset(): void {
      this.oConexionForm?.reset(); // Usa el método reset de Angular
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


    onSubmit() {

      if (this.oConexionForm?.invalid) {
       
        alert('Formulario inválido. Por favor, revisa los campos marcados.');
        return;
      }
    
      this.oConexionService.create(this.oConexionForm?.value).subscribe({
        next: (oConexion: IConexion) => {
          this.oConexion = oConexion;
          alert('Conexion creado con éxito');
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
