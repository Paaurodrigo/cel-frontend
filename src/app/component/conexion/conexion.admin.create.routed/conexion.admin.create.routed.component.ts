import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IConexion } from '../../../model/conexion.interface';
import { ConexionService } from '../../../service/conexion.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';
import { IInstalacion } from '../../../model/instalacion.interface';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleselectorComponent } from '../../inmueble/inmueble.selector/inmuebleselector.component';
import { InstalacionselectorComponent } from '../../instalacion/instalacion.selector/isntalacionselector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

declare let bootstrap: any;
@Component({
  selector: 'app-conexion.admin.create.routed',
  templateUrl: './conexion.admin.create.routed.component.html',
  styleUrls: ['./conexion.admin.create.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,  // Agrega este módulo
    MatInputModule,      // Agrega este módulo para los inputs dentro del form field
    ReactiveFormsModule, // Si usas formularios reactivos
    FormsModule,         // Si usas ngModel
    CommonModule,
    RouterModule,
    MatNativeDateModule,  
    MatDatepickerModule,


  ],
})
export class ConexionAdminCreateRoutedComponent implements OnInit {
 
  id: number = 0;
  oConexionForm: FormGroup | undefined = undefined;
  oInstalacionForm: FormGroup | undefined = undefined;
  oConexion: IConexion | null = null;
  oInmueble: IInmueble = {} as IInmueble;
  oInstalacion: IInstalacion = {} as IInstalacion;
  readonly dialog = inject(MatDialog);
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});

  constructor(
    private oConexionService: ConexionService,
    private oRouter: Router,
   
  ) {}

  ngOnInit() {
    this.createForm();
    this.oConexionForm?.markAllAsTouched();
  }

  createForm() {
    this.oConexionForm = new FormGroup({
      fecha: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      potencia: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]),
      instalacion: new FormGroup({
        id: new FormControl('', [Validators.required]),
        nombre: new FormControl(''),
      }),
      inmueble: new FormGroup({
        id: new FormControl('', [Validators.required]),
        cups: new FormControl(''),
        direccion: new FormControl(''),
      })
    });
  }

  

  updateForm() {
    this.oConexionForm?.controls['id'].setValue(this.oConexion?.id);
    this.oConexionForm?.controls['fecha'].setValue(this.oConexion?.fecha);
    this.oConexionForm?.controls['porcentaje'].setValue(this.oConexion?.porcentaje);
    this.oConexionForm?.controls['potencia'].setValue(this.oConexion?.potencia);
    this.oInstalacionForm?.controls['Instalacion'].setValue({
      id: null,
      nombre: null,
    });
    this.oConexionForm?.controls['Inmueble'].setValue({
      id: null,
      cups: null,
      direccion: null,
     
    });

  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }
  onReset() {
    this.updateForm();
    return false;
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/conexion/byinstalacion/plist/' + this.oConexion?.instalacion?.id]);
  }

  onSubmit() {
    console.log("Datos antes de enviar:", this.oConexionForm?.value);
    if (!this.oConexionForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oConexionService.create1(this.oConexionForm?.value).subscribe({
        next: (oConexion: IConexion) => {
          this.oConexion = oConexion;
          this.showModal('Conexion creada con el id: ' + this.oConexion.id);
        },
        error: (error) => {
          this.showModal('Error al crear la conexion');
          console.error(error);
        },
      });
    }
  }
  
  showInmuebleSelectorModal() {
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
        this.oConexionForm?.controls['inmueble'].setValue({
          id: result.id,
          cups: result.cups,
          direccion: result.direccion,
        });
      }
    });
    return false;
  }

  showInstalacionSelectorModal() {
    const dialogRef = this.dialog.open(InstalacionselectorComponent, {
      height: '500px',
      maxHeight: '800px',
      width: '80%',
      maxWidth: '90%',
      


    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.oConexionForm?.controls['instalacion'].setValue({
          id: result.id,
          nombre: result.nombre,
            
        });
      }
    });
    return false;
  }
}