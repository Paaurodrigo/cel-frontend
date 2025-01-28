import { Component, OnInit } from '@angular/core';
import { IInstalacion } from '../../../model/instalacion.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InstalacionService } from '../../../service/instalacion.service';
import { CommonModule } from '@angular/common';

declare let bootstrap: any;

@Component({
  selector: 'app-instalacion.admin.edit.routed',
  templateUrl: './instalacion.admin.edit.routed.component.html',
  styleUrls: ['./instalacion.admin.edit.routed.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
})
export class InstalacionAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oInstalacionForm: FormGroup | undefined = undefined;
  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';

  myModal: any;
  constructor(private oActivatedRoute: ActivatedRoute,
    private oInstalacionService: InstalacionService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }




  ngOnInit() {
    this.createForm();
    this.get();
    this.oInstalacionForm?.markAllAsTouched();
  }
  createForm() {
    this.oInstalacionForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      paneles: new FormControl('', [Validators.required]),
      potenciaPanel : new FormControl(''),
      potenciaTotal : new FormControl(''),
      potenciadisponible: new FormControl(''),
      precioKw: new FormControl('',)
     
    });
  }

  onReset() {
    this.oInstalacionService.get(this.id).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion= oInstalacion;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oInstalacionForm?.controls['id'].setValue(this.oInstalacion?.id);
    this.oInstalacionForm?.controls['nombre'].setValue(this.oInstalacion?.nombre);
    this.oInstalacionForm?.controls['paneles'].setValue(this.oInstalacion?.paneles);
    this.oInstalacionForm?.controls['potenciaPanel'].setValue(this.oInstalacion?.potenciaPanel);
    this.oInstalacionForm?.controls['potenciaTotal'].setValue(this.oInstalacion?.potenciaTotal);
    this.oInstalacionForm?.controls['potenciadisponible'].setValue(this.oInstalacion?.potenciaDisponible);
    this.oInstalacionForm?.controls['precioKw'].setValue(this.oInstalacion?.precioKw);
    
  }

  get() {
    this.oInstalacionService.get(this.id).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  showModal(strMessage: string) {
    this.strMessage = strMessage;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/instalacion/plist/']);
  };

  onSubmit() {
    if (!this.oInstalacionForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oInstalacionService.update(this.oInstalacionForm?.value).subscribe({
        next: (oInstalacion: IInstalacion) => {
          this.oInstalacion = oInstalacion;
          this.updateForm();
          this.showModal('Instalacion ' + this.oInstalacion.id + ' actualizado');
        },
        error: (error) => {
          this.showModal('Error al actualizar el usuario');
          console.error(error);
        },
      });
    }
  }

}



