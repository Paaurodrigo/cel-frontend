import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IConexion } from '../../../model/conexion.interface';
import { IPage } from '../../../model/model.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { ConexionService } from '../../../service/conexion.service';
import { PdfService } from '../../../service/pdf.service';

@Component({
  selector: 'app-conexion.byinstalacion.admin.plist.routed',
  templateUrl: './conexion.byintalacion.admin.plist.routed.component.html',
  styleUrls: ['./conexion.byintalacion.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ConexionByInstalacionAdminPlistRoutedComponent implements OnInit {
  
  oPage: IPage<IConexion> | null = null;
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  strField: string = '';
  strDir: string = '';
  id_instalacion: number = 0;
  strFiltro: string = '';
  arrBotonera: string[] = [];
  instalacion: any = {}; 
  porcentajeUtilizado: number = 0; 

  private debounceSubject = new Subject<string>();

  constructor(
    private oConexionService: ConexionService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private pdfService: PdfService,
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe(() => {
      this.getPage();
    });
  }

  ngOnInit() {
    this.id_instalacion = Number(this.oActivatedRoute.snapshot.paramMap.get('id'));
    console.log('ID Instalación:', this.id_instalacion);
    this.getPage();
    this.getInstalacionInfo();
  }

  getInstalacionInfo() {
    this.oConexionService.getInstalacionById(this.id_instalacion).subscribe({
      next: (data) => {
        this.instalacion = data; 
      },
      error: (err) => {
        console.error('Error al obtener instalación:', err);
      },
    });
  }

  enviarCorreo(conexion: any) {
    const jsonData = {
      id: conexion.id,
      fecha: conexion.fecha,
      inmueble: {
        id: conexion.inmueble.id,
        socio: {
          id: conexion.inmueble.socio.id,
          email: conexion.inmueble.socio.email,
          nombre: conexion.inmueble.socio.nombre
        }
      }
    };
  
    console.log('JSON corregido:', JSON.stringify(jsonData));
  
    this.oConexionService.enviarCorreo(jsonData).subscribe({
      next: () => console.log('Correo enviado correctamente'),
      error: (err) => console.error('Error al enviar el correo:', err)
    });
  }
  

  getPage() {
    console.log('ID Instalación en getPage:', this.id_instalacion);
    this.oConexionService
      .getPageXInstalacion(
        this.nPage,       
        this.nRpp,        
        this.strField,    
        this.strDir,      
        this.strFiltro,   
        this.id_instalacion    
      )
      .subscribe({
        next: (oPageFromServer: IPage<IConexion>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  
  view(oConexion: IConexion) {
    this.oRouter.navigate(['admin/conexion/view', oConexion.id]);
  }

  // ✅ Corregido: Ahora pasamos el ID de la instalación, no todo el objeto `instalacion`
  downloadPdf() {
    this.pdfService.downloadPdf(this.id_instalacion).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `acuerdo-autoconsumo-${this.id_instalacion}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al generar el PDF:', error);
    });
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  getPotenciaDisponiblePorcentaje(): string {
    if (!this.instalacion || !this.instalacion.potenciaTotal || this.instalacion.potenciaTotal === 0) {
      return '0.00'; // Evita división por cero
    }
    return ((this.instalacion.potenciaDisponible / this.instalacion.potenciaTotal) * 100).toFixed(2);
  }
  

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }
}
