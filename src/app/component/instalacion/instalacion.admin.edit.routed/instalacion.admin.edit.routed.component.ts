import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';

declare let bootstrap: any;

@Component({
  selector: 'app-instalacion.admin.edit.routed',
  templateUrl: './instalacion.admin.edit.routed.component.html',
  styleUrls: ['./instalacion.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatIconModule
  ],
})
export class InstalacionAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oInstalacionForm!: FormGroup;
  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';
  direccionSubject: Subject<string> = new Subject<string>();
  myModal: any;
  sugerencias: any[] = [];

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oInstalacionService: InstalacionService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oInstalacionForm.markAllAsTouched();
  }

  createForm() {
    this.oInstalacionForm = new FormGroup({
      id: new FormControl('', Validators.required),
      cau: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      paneles: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      potenciaPanel: new FormControl('', [Validators.pattern(/^\d+(\.\d{1,3})?$/)]),
      potenciaTotal: new FormControl(''),
      potenciaDisponible: new FormControl(''),
      precioKw: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      direccion: new FormControl('', [Validators.required]),
      direccionBase: new FormControl(''),
      numero: new FormControl('', [Validators.pattern(/^[0-9]+$/)])
    });

    this.oInstalacionForm.get('paneles')?.valueChanges.subscribe(() => this.calcularPotenciaTotal());
    this.oInstalacionForm.get('potenciaPanel')?.valueChanges.subscribe(() => this.calcularPotenciaTotal());
    this.oInstalacionForm.get('numero')?.valueChanges.subscribe(() => this.actualizarDireccionCompleta());
  }

  get() {
    this.oInstalacionService.get(this.id).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
        this.updateForm();
        this.setupPotenciaCalculada();
      },
      error: (error) => console.error(error)
    });
  }

  updateForm() {
    if (!this.oInstalacion) return;
    this.oInstalacionForm.patchValue({ ...this.oInstalacion });
  }

  onReset() {
    this.get();
  }

  onSubmit() {
    if (!this.oInstalacionForm.valid) {
      this.showModal('Formulario no válido');
      return;
    }

    this.oInstalacionForm.get('potenciaDisponible')?.setValue(
      this.oInstalacionForm.get('potenciaTotal')?.value
    );

    const formData = { ...this.oInstalacionForm.value };
    delete formData.direccionBase;

    this.oInstalacionService.update(formData).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
        this.updateForm();
        this.showModal(`Instalación ${oInstalacion.id} actualizada correctamente`);
      },
      error: (error) => {
        this.showModal('Error al actualizar la instalación');
        console.error(error);
      }
    });
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), { keyboard: false });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/instalacion/plist']);
  };

  setupPotenciaCalculada() {
    const panelesControl = this.oInstalacionForm.get('paneles');
    const potenciaPanelControl = this.oInstalacionForm.get('potenciaPanel');

    if (panelesControl && potenciaPanelControl) {
      panelesControl.valueChanges.subscribe(() => this.calcularPotenciaTotal());
      potenciaPanelControl.valueChanges.subscribe(() => this.calcularPotenciaTotal());
    }
  }

  calcularPotenciaTotal() {
    const paneles = parseFloat(this.oInstalacionForm.get('paneles')?.value);
    const potenciaPanel = parseFloat(this.oInstalacionForm.get('potenciaPanel')?.value);

    if (!isNaN(paneles) && !isNaN(potenciaPanel)) {
      const potenciaTotal = parseFloat((paneles * potenciaPanel).toFixed(2));
      this.oInstalacionForm.get('potenciaTotal')?.setValue(potenciaTotal);
      this.oInstalacionForm.get('potenciaDisponible')?.setValue(potenciaTotal);
    }
  }

  seleccionarDireccion(sugerencia: any) {
    const direccionBase = [
      sugerencia.properties.name,
      sugerencia.properties.postcode,
      sugerencia.properties.city,
    
    ].filter(Boolean).join(', ');

    this.oInstalacionForm.patchValue({ direccionBase });
    this.actualizarDireccionCompleta();
    this.sugerencias = [];
  }

  actualizarDireccionCompleta() {
    const numero = this.oInstalacionForm.get('numero')?.value || '';
    const direccionBase = this.oInstalacionForm.get('direccionBase')?.value || '';

    if (direccionBase) {
      const partes: string[] = direccionBase.split(',');
      const nombreCalle = partes[0]?.trim();
      const resto = partes.slice(1).map((p: string) => p.trim()).join(', ');
      const direccionFinal = numero ? `${nombreCalle}, ${numero}, ${resto}` : direccionBase;

      this.oInstalacionForm.patchValue({ direccion: direccionFinal });
    }
  }

  onSearchDireccion(): void {
    const direccion = this.oInstalacionForm.get('direccion')?.value;
    this.direccionSubject.next(direccion);
  }
}
