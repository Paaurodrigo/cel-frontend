import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

declare let bootstrap: any;
@Component({
  selector: 'app-instalacion.admin.create.routed',
  templateUrl: './instalacion.admin.create.routed.component.html',
  styleUrls: ['./instalacion.admin.create.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
})
export class InstalacionAdminCreateRoutedComponent implements OnInit {
  oInstalacionForm: FormGroup;
  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';
  myModal: any;
  constructor( private oInstalacionService: InstalacionService,
    private oRouter: Router,
    private fb: FormBuilder
  ) {
    this.oInstalacionForm = this.fb.group({}); // Inicialización vacía para evitar errores
   }

  ngOnInit() {
    this.createForm();
    this.oInstalacionForm?.markAllAsTouched();
  }

  createForm() {
    this.oInstalacionForm = this.fb.group({
      nombre: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      paneles: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]], // Solo enteros positivos
      potenciaPanel: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,3})?$/)]], // Decimales permitidos
      precioKw: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]], // Solo números enteros positivos

    });
  
    this.oInstalacionForm.get('paneles')?.valueChanges.subscribe(() => {
      this.calcularPotenciaTotal();
    });
  
    this.oInstalacionForm.get('potenciaPanel')?.valueChanges.subscribe(() => {
      this.calcularPotenciaTotal();
    });
  }
  
  calcularPotenciaTotal() {
    const paneles = parseInt(this.oInstalacionForm?.get('paneles')?.value) || 0;
    const potenciaPanel = parseFloat(this.oInstalacionForm?.get('potenciaPanel')?.value) || 0;
  
    if (!isNaN(paneles) && !isNaN(potenciaPanel) && paneles > 0 && potenciaPanel > 0) {
      const potenciaTotal = (paneles * potenciaPanel) / 1000; // Convertimos de W a kW
      this.oInstalacionForm?.patchValue({ 
        potenciaTotal: potenciaTotal.toFixed(3),
        potenciaDisponible: potenciaTotal.toFixed(3) // Inicialmente igual a potenciaTotal
      });
    }
  }
  
  
  
  
  
  showModal(mensaje: string): void {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal(): void {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/instalacion/plist']);
  }

  onReset(): void {
    this.oInstalacionForm?.reset(); // Usa el método reset de Angular
  }
  onSubmit() {
    if (this.oInstalacionForm?.invalid) {
      this.showModal('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    const formData = this.oInstalacionForm.value;
  
    // Asegurar que potenciaTotal y potenciaDisponible sean correctos antes de enviar
    formData.potenciaTotal = formData.potenciaTotal ? parseFloat(formData.potenciaTotal) : (formData.paneles * formData.potenciaPanel) / 1000;
    formData.potenciaDisponible = formData.potenciaDisponible ? parseFloat(formData.potenciaDisponible) : formData.potenciaTotal;
  
    this.oInstalacionService.create(formData).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
        this.showModal(`Instalación creada correctamente con el nombre: ${this.oInstalacion.nombre}`);
      },
      error: (err) => console.error(err),
    });
  }
  
  
  

  get panelesControl() {
    return this.oInstalacionForm?.get('paneles');
  }

  get potenciaPanelControl() {
    return this.oInstalacionForm?.get('potenciaPanel');
  }

  get potenciaTotalControl() {
    return this.oInstalacionForm?.get('potenciaTotal');
  }


  get precioKwControl() {
    return this.oInstalacionForm?.get('precioKw');
  }

}
