import { Component, OnInit } from '@angular/core';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-instalacion.admin.view.routed',
  templateUrl: './instalacion.admin.view.routed.component.html',
  styleUrls: ['./instalacion.admin.view.routed.component.css']
})
export class InstalacionAdminViewRoutedComponent implements OnInit {
  id: number = 0;
  map: any;
  oInstalacion: IInstalacion = {} as IInstalacion;

  constructor(private oActivatedRoute: ActivatedRoute, private oInstalacionService: InstalacionService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
   
    
  }
  loadMap() {
    const direccion = this.oInstalacion.direccion;

    // Usa Nominatim para obtener coordenadas a partir de la dirección
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`)
      .then(res => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = data[0].lat;
          const lon = data[0].lon;

          this.map = L.map('map').setView([lat, lon], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);

         // Marcador
        L.marker([lat, lon]).addTo(this.map)
        .bindPopup(this.oInstalacion.nombre)
        .openPopup();

      // 🔵 Círculo de 2000 metros
      L.circle([lat, lon], {
        color: 'blue',
        fillColor: '#cce5ff',
        fillOpacity: 0.3,
        radius: 2000
      }).addTo(this.map);
        }
      });
  }
  getOne() {
    this.oInstalacionService.getOne(this.id).subscribe({
      next: (data: IInstalacion) => {
        this.oInstalacion = data;
        this.loadMap();
      },
      error: (err) => {
        console.error('Error al obtener los datos del Instalacion', err);
      }
    });
  }


}
