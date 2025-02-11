import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { SessionService } from '../../service/session.service';

@Component({
  selector: 'app-shared-menu-unrouted',
  templateUrl: './shared.menu.unrouted.component.html',
  styleUrls: ['./shared.menu.unrouted.component.css'],
  imports: [RouterLink],
  standalone: true,
})
export class SharedMenuUnroutedComponent implements OnInit {
  strRuta: string = '';
  activeSession: boolean = false;
  userNombre: string = '';
userApellido: string = '';
userEmail: string = '';
userRole: string = '';

  constructor(
    private oRouter: Router,
    private oSessionService: SessionService
  ) {
    this.oRouter.events.subscribe((oEvent) => {
      if (oEvent instanceof NavigationEnd) {
        this.strRuta = oEvent.url;
      }
    });
   
   
  }



 
  

  ngOnInit() {
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

  
}
