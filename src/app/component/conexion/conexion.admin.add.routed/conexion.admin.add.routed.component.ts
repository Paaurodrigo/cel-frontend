import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IConexion } from '../../../model/conexion.interface';
import { ConexionService } from '../../../service/conexion.service';
import { SocioselectorComponent } from '../../socio/socioselector/socioselector.component';
import { IInstalacion } from '../../../model/instalacion.interface';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleselectorComponent } from '../../inmueble/inmueble.selector/inmuebleselector.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

declare let bootstrap: any;

@Component({
  selector: 'app-conexion.admin.add.routed',
  templateUrl: './conexion.admin.add.routed.component.html',
  styleUrls: ['./conexion.admin.add.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [DatePipe]
})
export class ConexionAdminAddRoutedComponent implements OnInit {

  idInstalacionRuta: number = 0;
  oConexionForm!: FormGroup;
  oConexion: IConexion | null = null;
  oInmueble: IInmueble = {} as IInmueble;
  oInstalacion: IInstalacion = {} as IInstalacion;
  readonly dialog = inject(MatDialog);
  strMessage: string = '';
  myModal: any;

  constructor(
    private oConexionService: ConexionService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.idInstalacionRuta = Number(this.oActivatedRoute.snapshot.paramMap.get('id')); // Cogemos la instalación de la URL
    this.createForm();
    this.loadInstalacion();
  }

  createForm() {
    this.oConexionForm = new FormGroup({
      fecha: new FormControl('', [Validators.required]),
      potencia: new FormControl('', [Validators.required]),
      instalacion: new FormGroup({
        id: new FormControl(this.idInstalacionRuta, [Validators.required]),
        nombre: new FormControl({ value: '', disabled: true }), // Solo lectura
      }),
      inmueble: new FormGroup({
        id: new FormControl('', [Validators.required]),
        cups: new FormControl(''),
        direccion: new FormControl(''),
      })
    });
  }

  loadInstalacion() {
    this.oConexionService.getInstalacionById(this.idInstalacionRuta).subscribe({
      next: (data) => {
        this.oInstalacion = data;
        this.oConexionForm.controls['instalacion'].patchValue({
          id: this.idInstalacionRuta,
          nombre: data.nombre
        });
      },
      error: (err) => {
        console.error('Error al cargar instalación:', err);
        this.showModal('Error al cargar la instalación. Redirigiendo...');
        setTimeout(() => this.oRouter.navigate(['/admin/instalacion/plist']), 2000);
      }
    });
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/conexion/byinstalacion/plist/' + this.oConexion?.instalacion?.id]);
  }

  onReset() {
    this.oConexionForm.reset();
    this.oConexionForm.controls['instalacion'].patchValue({
      id: this.idInstalacionRuta,
      nombre: this.oInstalacion?.nombre
    });
    return false;
  }

  onSubmit() {
    if (!this.oConexionForm.valid) {
      this.showModal('Formulario no válido');
      return;
    }
  
    const formData = this.oConexionForm.getRawValue();
    const fechaFormateada = this.datePipe.transform(formData.fecha, 'yyyy-MM-ddTHH:mm:ss');
  
    const datosAEnviar = {
      ...formData,
      fecha: fechaFormateada,
      instalacion: { id: this.idInstalacionRuta } // 👈 AÑADE ESTO
    };
  
    this.oConexionService.create1(datosAEnviar).subscribe({
      next: (oConexion: IConexion) => {
        this.oConexion = oConexion;
        this.showModal('Conexión creada con el id: ' + this.oConexion.id);
      },
      error: (error) => {
        const mensajeError = error?.error?.message || 'Error al crear la conexión';
        this.showModal(mensajeError);
        console.error(error);
      },
    });
  }
  

  showInmuebleSelectorModal() {
    const dialogRef = this.dialog.open(InmuebleselectorComponent, {
      height: '500px',
      maxHeight: '800px',
      width: '80%',
      maxWidth: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.oConexionForm.controls['inmueble'].setValue({
          id: result.id,
          cups: result.cups,
          direccion: result.direccion,
        });
      }
    });
    return false;
  }
}
