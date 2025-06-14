import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
})
export class InstalacionAdminCreateRoutedComponent implements OnInit {
  oInstalacionForm: FormGroup;
  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';
  myModal: any;
  sugerencias: any[] = [];
  cauValido: boolean | null = null;
  cauExiste: boolean = false;
  private cauSubject: Subject<string> = new Subject<string>();
  
  direccionSubject: Subject<string> = new Subject<string>();

  constructor(
    private oInstalacionService: InstalacionService,
    private oRouter: Router,
    private fb: FormBuilder
  ) {
    this.oInstalacionForm = this.fb.group({});
  }

  ngOnInit() {
    this.createForm();
    this.oInstalacionForm?.markAllAsTouched();

    this.cauSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(cau => {
      if (!cau) {
        this.cauValido = false;
        this.cauExiste = false;
      } else {
        this.cauValido = this.validarCAU(cau);
        if (this.cauValido) {
          this.checkCauExists(cau);
        } else {
          this.cauExiste = false;
        }
      }
    });
    
    // ✅ Photon API con debounce
    this.direccionSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(direccion => {
      if (!direccion || direccion.length < 3) {
        this.sugerencias = [];
        return;
      }

      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(direccion)}&limit=5&bbox=-1.75,37.8,0.75,40.9`)
  .then(res => res.json())
  .then(data => {
    this.sugerencias = data.features;
  })
  .catch(err => {
    console.error('Error al buscar direcciones:', err);
    this.sugerencias = [];
  });
    });
  }

  createForm() {
    this.oInstalacionForm = this.fb.group({
      nombre: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      paneles: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      potenciaPanel: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
      precioKw: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      direccion: ['', [Validators.required, Validators.minLength(3)]],
      direccionBase: [''], // ← no se guarda, solo interna
      cau: ['', [Validators.minLength(26), Validators.maxLength(26)]],
      numero: ['', [Validators.pattern(/^[0-9]+$/)]],
    });
  
    this.oInstalacionForm.get('paneles')?.valueChanges.subscribe(() => this.calcularPotenciaTotal());
    this.oInstalacionForm.get('potenciaPanel')?.valueChanges.subscribe(() => this.calcularPotenciaTotal());
  
    // 💥 escucha cambios en 'numero' y actualiza dirección
    this.oInstalacionForm.get('numero')?.valueChanges.subscribe(() => {
      this.actualizarDireccionCompleta();
    });
  }
  

  // ✅ Usamos Subject para que escuche cambios del input
  onSearchDireccion(): void {
    const direccion = this.oInstalacionForm.get('direccion')?.value;
    this.direccionSubject.next(direccion);
  }

  seleccionarDireccion(sugerencia: any): void {
    const direccionBase = [
      sugerencia.properties.name,
      sugerencia.properties.postcode,      
      sugerencia.properties.city,
    ].filter(Boolean).join(', ');
  
    this.oInstalacionForm.patchValue({
      direccionBase: direccionBase
    });
  
    this.actualizarDireccionCompleta();
  
    this.sugerencias = [];
  }
  
  
  
  onCauChange(): void {
    const cau = this.oInstalacionForm.get('cau')?.value;
    this.cauSubject.next(cau);
  }

  checkCauExists(cau: string): void {
    this.oInstalacionService.checkCauExists(cau).subscribe({
      next: (existe: boolean) => {
        this.cauExiste = existe;
        console.log('¿Existe CAU?:', existe);
      },
      error: (err) => {
        console.error('Error al comprobar CAU:', err);
        this.cauExiste = false;
      }
    });
  }

  validarCAU(cau: string): boolean {
    const cauRegex = /^[A-Z0-9]{26}$/;
    return cauRegex.test(cau);
  }
  

  calcularPotenciaTotal() {
    const paneles = parseInt(this.oInstalacionForm?.get('paneles')?.value) || 0;
    const potenciaPanel = parseFloat(this.oInstalacionForm?.get('potenciaPanel')?.value) || 0;

    if (!isNaN(paneles) && !isNaN(potenciaPanel) && paneles > 0 && potenciaPanel > 0) {
      const potenciaTotal = (paneles * potenciaPanel) / 1000;
      this.oInstalacionForm?.patchValue({
        potenciaTotal: potenciaTotal.toFixed(3),
        potenciaDisponible: potenciaTotal.toFixed(3)
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
    this.oInstalacionForm?.reset();
  }

  onSubmit() {
    if (this.oInstalacionForm?.invalid) {
      this.showModal('Formulario inválido. Por favor, revisa los campos marcados.');
      return;
    }
  
    const formData = this.oInstalacionForm.value;
  
    // 💥 Eliminar campo auxiliar antes de enviar
    delete formData.direccionBase;
  
    formData.potenciaTotal = formData.potenciaTotal
      ? parseFloat(formData.potenciaTotal)
      : (formData.paneles * formData.potenciaPanel) / 1000;
  
    formData.potenciaDisponible = formData.potenciaDisponible
      ? parseFloat(formData.potenciaDisponible)
      : formData.potenciaTotal;
  
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

  actualizarDireccionCompleta(): void {
    const numero = this.oInstalacionForm.get('numero')?.value || '';
    const direccionBase = this.oInstalacionForm.get('direccionBase')?.value || '';
  
    if (direccionBase) {
      const partes: string[] = direccionBase.split(',');
      const nombreCalle = partes[0]?.trim();
      const resto = partes.slice(1).map((p: string) => p.trim()).join(', ');
  
      const direccionFinal = numero
        ? `${nombreCalle}, ${numero}, ${resto}`
        : direccionBase;
  
      this.oInstalacionForm.patchValue({ direccion: direccionFinal });
    }
  }
  
  


}
