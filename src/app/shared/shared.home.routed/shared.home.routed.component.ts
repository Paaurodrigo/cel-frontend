import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import L from 'leaflet';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  contactForm: FormGroup;
  isHeaderFixed: boolean = false;
  showMobileMenu: boolean = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicializar AOS (Animate On Scroll)
    

    // Inicializar contadores
    this.initializeStats();

    this.initMap(); // puedes cargar leaflet si usas mapa
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

    // Header fijo al hacer scroll
    this.isHeaderFixed = window.scrollY > 50;
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

  // Animación de estadísticas
  private initializeStats() {
    const stats = [
      { element: 'familias', target: 120, current: 0 },
      { element: 'instalaciones', target: 3, current: 0 },
      { element: 'energia', target: 250, current: 0 }
    ];

    stats.forEach(stat => {
      this.animateStat(stat);
    });
  }

  private animateStat(stat: { element: string, target: number, current: number }) {
    const element = document.getElementById(stat.element);
    if (!element) return;

    const increment = stat.target / 100;
    const interval = setInterval(() => {
      stat.current += increment;
      if (stat.current >= stat.target) {
        stat.current = stat.target;
        clearInterval(interval);
      }
      element.textContent = Math.round(stat.current).toString();
    }, 20);
  }

  // Navegación suave
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Toggle menú móvil
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Manejo del formulario de contacto
  onSubmit() {
    if (this.contactForm.valid) {
      // Aquí iría la lógica para enviar el formulario
      console.log(this.contactForm.value);
      this.contactForm.reset();
    }
  }

  initMap() {
    const map = L.map('map').setView([39.5, -0.4], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    // Añadir marcadores según instalaciones
  }
}
