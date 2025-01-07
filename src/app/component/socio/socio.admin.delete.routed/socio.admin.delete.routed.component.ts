import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ISocio } from '../../../model/socio.interface';
import { SocioService } from '../../../service/socio.service';


declare let bootstrap: any;

@Component({
  selector: 'app-socio.admin.delete.routed',
  templateUrl: './socio.admin.delete.routed.component.html',
  styleUrls: ['./socio.admin.delete.routed.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class SocioAdminDeleteRoutedComponent implements OnInit {

 oSocio: ISocio | null = null;
  strMessage: string = '';
  myModal: any;
  constructor(
    private oSocioService: SocioService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) { }

 
  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oSocioService.get(id).subscribe({
      next: (oSocio: ISocio) => {
        this.oSocio = oSocio;
      },
      error: (err) => {
        this.showModal('Error al cargar el usuario');
      },
    });
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  deleteSocio(): void {
    this.oSocioService.delete(this.oSocio!.id).subscribe({
      next: (data) => {
        this.showModal(
          'Socio con id ' + this.oSocio!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el socio');
      },
    });
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/socio/plist']);
  }
  
}

