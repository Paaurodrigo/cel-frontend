import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';

declare let bootstrap: any;
@Component({
  selector: 'app-inmueble.admin.edit.routed',
  templateUrl: './inmueble.admin.edit.routed.component.html',
  styleUrls: ['./inmueble.admin.edit.routed.component.css'],
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,CommonModule],
})
export class InmuebleAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oInmuebleForm: FormGroup | undefined = undefined;
  oInmueble: IInmueble | null = null;
  strMessage: string = '';

  myModal: any;
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oInmuebleService: InmuebleService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
   }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oInmuebleForm?.markAllAsTouched();
  }
  createForm() {
    this.oInmuebleForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      cups: new FormControl('', [Validators.required]),
      direccion : new FormControl(''),
      codigoPostal : new FormControl(''),
      municipio: new FormControl(''),
      referenciacatastral: new FormControl('',),
      potencia1 : new FormControl('',),
      potencia2 : new FormControl('',),
      tension : new FormControl('',),
      uso : new FormControl('',),
     
    });
  }

  onReset() {
    this.oInmuebleService.get(this.id).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble= oInmueble;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oInmuebleForm?.controls['id'].setValue(this.oInmueble?.id);
    this.oInmuebleForm?.controls['cups'].setValue(this.oInmueble?.cups);
    this.oInmuebleForm?.controls['direccion'].setValue(this.oInmueble?.direccion);
    this.oInmuebleForm?.controls['codigoPostal'].setValue(this.oInmueble?.codigoPostal);
    this.oInmuebleForm?.controls['municipio'].setValue(this.oInmueble?.municipio);
    this.oInmuebleForm?.controls['referenciacatastral'].setValue(this.oInmueble?.refCatas);
    this.oInmuebleForm?.controls['potencia1'].setValue(this.oInmueble?.potencia1);
    this.oInmuebleForm?.controls['potencia2'].setValue(this.oInmueble?.potencia2)
    this.oInmuebleForm?.controls['tension'].setValue(this.oInmueble?.tension);
    this.oInmuebleForm?.controls['uso'].setValue(this.oInmueble?.uso)
    
  }

  get() {
    this.oInmuebleService.get(this.id).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
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
    this.oRouter.navigate(['/admin/inmueble/plist/']);
  };

  onSubmit() {
    if (!this.oInmuebleForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oInmuebleService.update(this.oInmuebleForm?.value).subscribe({
        next: (oInmueble: IInmueble) => {
          this.oInmueble = oInmueble;
          this.updateForm();
          this.showModal('Inmueble ' + this.oInmueble.id + ' actualizado');
        },
        error: (error) => {
          this.showModal('Error al actualizar el usuario');
          console.error(error);
        },
      });
    }
  }

}
