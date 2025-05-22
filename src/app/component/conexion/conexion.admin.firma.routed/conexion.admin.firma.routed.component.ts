import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConexionService } from '../../../service/conexion.service';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad'; // ✅ IMPORTACIÓN CORRECTA
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conexion-admin-firma',
  standalone: true,
  imports: [AngularSignaturePadModule, CommonModule
  ], // ✅ IMPORTA EL MÓDULO AQUÍ
  templateUrl: './conexion.admin.firma.routed.component.html',
  styleUrls: ['./conexion.admin.firma.routed.component.css']
})
export class ConexionAdminFirmaRoutedComponent implements AfterViewInit {
  
  @ViewChild(SignaturePadComponent) signaturePad!: SignaturePadComponent; 
  conexionId!: number;
  firmaBase64: string | null = null;
  firmaGuardada: boolean = false;
  mensaje: string = '';
  mensajeError: string = '';
  mensajeMostrado: boolean = false;

  signaturePadOptions = {
    minWidth: 1,
    maxWidth: 3,
    penColor: "black",
    backgroundColor: "white",
  };

  constructor(
    private route: ActivatedRoute,
    private conexionService: ConexionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.conexionId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID obtenido:', this.conexionId);
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
  }

  limpiarFirma(): void {
    this.signaturePad.clear();
    this.firmaBase64 = null;
    this.firmaGuardada = false;
  }

  guardarFirma(): void {
    if (this.signaturePad.isEmpty()) {
      alert("Por favor, dibuja tu firma antes de guardar.");
      return;
    }
    this.firmaBase64 = this.signaturePad.toDataURL();
    this.firmaGuardada = true;
  }

  firmarConexion(): void {
    this.mensaje = '';
    this.mensajeError = '';
    this.mensajeMostrado = false;
  
    // Auto-guardar antes de comprobar si está vacía
    if (this.signaturePad.isEmpty()) {
      this.mensajeError = "❌ Por favor, dibuja tu firma antes de enviarla.";
      this.mensajeMostrado = true;
      return;
    }
  
    this.firmaBase64 = this.signaturePad.toDataURL();
    this.firmaGuardada = true;
  
    this.conexionService.confirmarFirma(this.conexionId, this.firmaBase64).subscribe(
      (response: any) => {
        // Muestra el mensaje recibido del backend
        this.mensajeError = response.message || "✅ Firma enviada correctamente.";
        this.mensajeError = '';
        this.mensajeMostrado = true;
    
        setTimeout(() => {
          this.router.navigate(['/admin/conexion/plist']);
        }, 1500);
      },
      error => {
        console.error("Error al enviar la firma:", error);
        this.mensajeError = error.error?.message || "✅ Firma enviada correctamente.";
        this.mensaje = '';
        this.mensajeMostrado = true;
      }
    );
    
    
  }
  
  
}
