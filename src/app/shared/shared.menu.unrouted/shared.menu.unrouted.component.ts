import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { SessionService } from '../../service/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-menu-unrouted',
  templateUrl: './shared.menu.unrouted.component.html',
  styleUrls: ['./shared.menu.unrouted.component.css'],
  imports: [RouterLink, CommonModule],
  standalone: true,
})
export class SharedMenuUnroutedComponent implements OnInit {
  strRuta: string = '';
  activeSession: boolean = false;
  userNombre: string = '';
userApellido: string = '';
userEmail: string = '';
userRole: string = '';
isDarkMode: boolean = false;
  constructor(
    private oRouter: Router,
    private oSessionService: SessionService,
    private renderer: Renderer2
  ) {
    this.oRouter.events.subscribe((oEvent) => {
      if (oEvent instanceof NavigationEnd) {
        this.strRuta = oEvent.url;
      }
    });
   
   
  }



 
  

  ngOnInit() {
    const savedMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'true';
    this.updateDarkMode();
  
    console.log("Modo oscuro guardado:", this.isDarkMode);

    this.activeSession = this.oSessionService.isSessionActive();
    if (this.activeSession) {
      this.userEmail = this.oSessionService.getSessionEmail();
      this.userNombre = this.oSessionService.getSessionNombre();
      this.userApellido = this.oSessionService.getSessionApellido1();
      this.userRole = this.oSessionService.getSessionRole();

  

    }
    this.oSessionService.onLogin().subscribe({
      next: () => {        
        this.activeSession = true;
        this.userEmail = this.oSessionService.getSessionEmail();
        this.userNombre = this.oSessionService.getSessionNombre();
        this.userApellido = this.oSessionService.getSessionApellido1();
        this.userRole = this.oSessionService.getSessionRole();
     
    },
      
    });
    this.oSessionService.onLogout().subscribe({
      next: () => {
        this.activeSession = false;
        this.userEmail = '';
        this.userNombre = '';
        this.userApellido = '';
        this.userRole = ""; // Reinicia el valor al cerrar sesión
    
      },
    });

  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    console.log('🔄 Estado cambiado a:', this.isDarkMode);
    this.updateDarkMode();
  }
  
  
  updateDarkMode() {
    const body = document.body;
  
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
      console.log('🌓 Modo oscuro activado - Clases actuales:', body.classList.value);
    } else {
      body.classList.remove('dark-mode');
      console.log('☀️ Modo claro activado - Clases actuales:', body.classList.value);
    }
  }
  
  
  

  
}
