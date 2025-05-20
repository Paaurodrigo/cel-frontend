import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import L from 'leaflet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shared.home.routed',
  templateUrl: './shared.home.routed.component.html',
  styleUrls: ['./shared.home.routed.component.css'],
  standalone: true, // ✅ Esto es clave para componentes standalone
  imports: [
    TranslateModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule

  ]
})
export class SharedHomeRoutedComponent implements OnInit {
  resumen = [
    { title: 'Productos', value: 152, icon: 'inventory' },
    { title: 'Proveedores', value: 45, icon: 'groups' },
    { title: 'Inmuebles', value: 18, icon: 'home_work' },
    { title: 'Conexiones', value: 88, icon: 'hub' },
  ];

  ultimosProductos = [
    { nombre: 'Tomate triturado', categoria: 'Conservas', imagenUrl: '/assets/img1.jpg' },
    { nombre: 'Aceite virgen', categoria: 'Aceites', imagenUrl: '/assets/img2.jpg' },
  ];


  initMap() {
    const map = L.map('map').setView([39.5, -0.4], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    // Añadir marcadores según instalaciones
  }

  constructor() { }

 
  ngOnInit() {
    this.initMap(); // puedes cargar leaflet si usas mapa
  }

}
