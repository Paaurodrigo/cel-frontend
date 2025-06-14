import { Component, OnInit } from '@angular/core';
import { IInstalacion } from '../../../model/instalacion.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InstalacionService } from '../../../service/instalacion.service';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

declare let bootstrap: any;

@Component({
  selector: 'app-instalacion.admin.edit.routed',
  templateUrl: './instalacion.admin.edit.routed.component.html',
  styleUrls: ['./instalacion.admin.edit.routed.component.css'],
  standalone: true,
  imports: [MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      ReactiveFormsModule,
      RouterModule,
      CommonModule,
      MatIconModule],
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
    this.setupPotenciaCalculada(); // ← Añade esto
  }
  createForm() {
    this.oInstalacionForm = new FormGroup({
      cau: new FormControl('', [Validators.required]),
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
  }

  updateForm() {
    this.oInstalacionForm?.controls['cau'].setValue(this.oInstalacion?.cau);
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
      // ⚠️ Antes de guardar → forzamos que potenciadisponible sea igual que potenciaTotal
      this.oInstalacionForm?.controls['potenciadisponible'].setValue(
        this.oInstalacionForm?.controls['potenciaTotal'].value
      );
  
      this.oInstalacionService.update(this.oInstalacionForm?.value).subscribe({
        next: (oInstalacion: IInstalacion) => {
          this.oInstalacion = oInstalacion;
          this.updateForm();
  
          // ⚠️ Aquí volvemos a forzar en el form para que se vea bien en la UI
          this.oInstalacionForm?.controls['potenciadisponible'].setValue(
            this.oInstalacionForm?.controls['potenciaTotal'].value
          );
  
          this.showModal('Instalacion ' + this.oInstalacion.id + ' actualizada');
        },
        error: (error) => {
          this.showModal('Error al actualizar la instalacion');
          console.error(error);
        },
      });
    }
  }
  
  

  onPotenciaTotalChange(value: string): void {
    if (this.oInstalacion?.conexiones === 0) {
      const potenciaTotal = parseFloat(value);
      if (!isNaN(potenciaTotal)) {
        // Aquí decides la lógica → en este caso, igualar potenciaDisponible
        this.oInstalacionForm?.controls['potenciadisponible'].setValue(potenciaTotal);
      }
    }
  }
  
  
  setupPotenciaCalculada(): void {
    const panelesControl = this.oInstalacionForm?.get('paneles');
    const potenciaPanelControl = this.oInstalacionForm?.get('potenciaPanel');
  
    if (panelesControl && potenciaPanelControl) {
      panelesControl.valueChanges.subscribe(() => this.calcularPotenciaTotal());
      potenciaPanelControl.valueChanges.subscribe(() => this.calcularPotenciaTotal());
    }
  }
  
  calcularPotenciaTotal(): void {
    const paneles = parseFloat(this.oInstalacionForm?.get('paneles')?.value);
    const potenciaPanel = parseFloat(this.oInstalacionForm?.get('potenciaPanel')?.value);
  
    if (!isNaN(paneles) && !isNaN(potenciaPanel)) {
      const potenciaTotal = parseFloat((paneles * potenciaPanel).toFixed(2));
      this.oInstalacionForm?.get('potenciaTotal')?.setValue(potenciaTotal);
      this.oInstalacionForm?.get('potenciadisponible')?.setValue(potenciaTotal);
    }
  }
  

}



