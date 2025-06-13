import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IConexion } from '../../../model/conexion.interface';
import { IPage } from '../../../model/model.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { ConexionService } from '../../../service/conexion.service';
import { PdfService } from '../../../service/pdf.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-conexion.byinstalacion.admin.plist.routed',
  templateUrl: './conexion.byintalacion.admin.plist.routed.component.html',
  styleUrls: ['./conexion.byintalacion.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ConexionByInstalacionAdminPlistRoutedComponent implements OnInit, AfterViewInit {

  oPage: IPage<IConexion> | null = null;
  nPage: number = 0;
  nRpp: number = 10;
  strField: string = '';
  strDir: string = '';
  id_instalacion: number = 0;
  strFiltro: string = '';
  arrBotonera: string[] = [];
  instalacion: any = {};
  porcentajeUtilizado: number = 0;
 
  map: any; // Leaflet map

  datosInstalacionCargados: boolean = false;
  datosConexionesCargados: boolean = false;

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

  ngAfterViewInit(): void {
    setTimeout(() => this.tryLoadMap(), 1000);
  }

  tryLoadMap(): void {
    if (this.datosInstalacionCargados && this.datosConexionesCargados) {
      this.loadMap();
    } else {
      setTimeout(() => this.tryLoadMap(), 500);
    }
  }

  getInstalacionInfo() {
    this.oConexionService.getInstalacionById(this.id_instalacion).subscribe({
      next: (data) => {
        this.instalacion = data;
        this.datosInstalacionCargados = true;
        this.tryLoadMap();
      },
      error: (err) => {
        console.error('Error al obtener instalación:', err);
      },
    });
  }

  getPage() {
    this.oConexionService.getPageXInstalacion(
      this.nPage,
      this.nRpp,
      this.strField,
      this.strDir,
      this.strFiltro,
      this.id_instalacion
    ).subscribe({
      next: (oPageFromServer: IPage<IConexion>) => {
        this.oPage = oPageFromServer;
        this.arrBotonera = this.oBotoneraService.getBotonera(this.nPage, oPageFromServer.totalPages);
        this.datosConexionesCargados = true;
        this.tryLoadMap();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async loadMap(): Promise<void> {
    const direccion = this.instalacion.direccion;
    const coords = await this.geocode(direccion);
    if (!coords) return;

    this.map = L.map('map').setView([coords.lat, coords.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcador instalación
   // 📍 Marcador instalación
L.marker([coords.lat, coords.lon], {
  icon: L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  }),
})
  .addTo(this.map)


// 🔵 Círculo de 2km
L.circle([coords.lat, coords.lon], {
  color: 'blue',
  fillColor: '#aaffaa',
  fillOpacity: 0.3,
  radius: 2000, // 2km
}).addTo(this.map);

    

    // Inmuebles conectados
    for (const conexion of this.oPage!.content) {
      const dirInmueble = conexion.inmueble?.direccion;
      if (dirInmueble) {
        const inmuebleCoords = await this.geocode(dirInmueble);
        if (inmuebleCoords) {
          L.marker([inmuebleCoords.lat, inmuebleCoords.lon], {
            icon: L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', // Icono de casa
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -28],
            }),
            
          })
            .addTo(this.map)
            .bindPopup(`
              <b>Inmueble:</b> ${dirInmueble}<br>
              <b>Potencia:</b> ${conexion.potencia} kW<br>
              <b>Porcentaje:</b> ${(conexion.porcentaje * 100).toFixed(2)}%

            `);
        }
      }
    }
  }

  async geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data?.length) {
      return { lat: +data[0].lat, lon: +data[0].lon };
    }
    return null;
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

    this.oConexionService.enviarCorreo(jsonData).subscribe({
      next: () => console.log('Correo enviado correctamente'),
      error: (err) => console.error('Error al enviar el correo:', err)
    });
  }

 
  downloadPdf() {
    this.pdfService.downloadPdf(this.id_instalacion).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
  
      // Obtener fecha actual en formato "12-06-2025"
      const today = new Date();
      const fechaFormateada = today.toLocaleDateString('es-ES').replace(/\//g, '-');
  
      a.download = `Acuerdo de reparto firmado-${fechaFormateada}.pdf`;
  
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al generar el PDF:', error);
    });
  }
  

  downloadTxt() {
    this.pdfService.downloadTxt(this.id_instalacion).subscribe(response => {
      const blob = new Blob([response], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const anioActual = new Date().getFullYear();
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.instalacion.cau}_${anioActual}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al generar el TXT:', error);
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
    if (!this.instalacion?.potenciaTotal || this.instalacion.potenciaTotal === 0) {
      return '0.00';
    }
    return ((this.instalacion.potenciaDisponible / this.instalacion.potenciaTotal) * 100).toFixed(2);
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }
  view(oConexion: IConexion) {
    this.oRouter.navigate(['admin/conexion/view', oConexion.id]);
  }

}

