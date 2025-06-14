import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import L from 'leaflet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-shared-home-routed',
  templateUrl: './shared.home.routed.component.html',
  styleUrls: ['./shared.home.routed.component.css'],
  standalone: true, // ✅ Esto es clave para componentes standalone
  imports: [
    TranslateModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ]
})
export class SharedHomeRoutedComponent implements OnInit {
  displayedCount: number = 0;
  finalCount: number = 120;
  
  


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

  ngOnInit(): void {
    // Inicializar AOS (Animate On Scroll)
    

    // Inicializar contadores
    this.initCounters();

    this.initMap(); // puedes cargar leaflet si usas mapa

    this.animateCount();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Mostrar/ocultar botón "Volver arriba"
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
      if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'flex';
      } else {
        backToTopButton.style.display = 'none';
      }
    }

    // Efecto de header al hacer scroll
    const header = document.querySelector('header');
    if (header) {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  // Función para volver arriba
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Función para mostrar/ocultar el formulario de contacto
  toggleContactForm(): void {
    const modal = document.getElementById('contactModal');
    if (modal) {
      if (modal.style.display === 'flex') {
        modal.style.display = 'none';
      } else {
        modal.style.display = 'flex';
      }
    }
  }

  // Inicializar contadores con animación
  private initCounters(): void {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target')!;
      let count = 0;

      const updateCount = () => {
        const increment = target / speed;
        
        if (count < target) {
          count += increment;
          (counter as HTMLElement).innerText = Math.ceil(count).toString();
          setTimeout(updateCount, 1);
        } else {
          (counter as HTMLElement).innerText = target.toString();
        }
      };

      updateCount();
    });
  }

  // Manejar envío del formulario de contacto
  onContactSubmit(event: Event): void {
    event.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    // Por ahora solo cerramos el modal
    this.toggleContactForm();
  }

  animateCount() {
    const duration = 1000; // duración total en ms
    const frameRate = 30; // cada cuántos ms actualizar
    const totalSteps = duration / frameRate;
    let currentStep = 0;
  
    const increment = this.finalCount / totalSteps;
  
    const interval = setInterval(() => {
      this.displayedCount += increment;
      currentStep++;
  
      if (currentStep >= totalSteps) {
        this.displayedCount = this.finalCount;
        clearInterval(interval);
      }
    }, frameRate);
  }
}






