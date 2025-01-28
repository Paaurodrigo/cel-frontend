import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';


declare let bootstrap: any;

@Component({
  selector: 'app-instalacion.admin.delete.routed',
  templateUrl: './instalacion.admin.delete.routed.component.html',
  styleUrls: ['./instalacion.admin.delete.routed.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class InstalacionAdminDeleteRoutedComponent implements OnInit {

  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';
  myModal: any;
  constructor(private oInstalacionService: InstalacionService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router) { }

    ngOnInit(): void {
      let id = this.oActivatedRoute.snapshot.params['id'];
      this.oInstalacionService.get(id).subscribe({
        next: (oInstalacion: IInstalacion) => {
          this.oInstalacion = oInstalacion;
        },
        error: (err) => {
          this.showModal('Error al cargar el Instalacion');
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
  
    deleteInstalacion(): void {
      this.oInstalacionService.delete(this.oInstalacion!.id).subscribe({
        next: (data) => {
          this.showModal(
            'La instalacion ' + this.oInstalacion!.nombre + ' ha sido borrada'
          );
        },
        error: (error) => {
          this.showModal('Error al borrar el Instalacion');
        },
      });
    }
  
    hideModal = () => {
      this.myModal.hide();
      this.oRouter.navigate(['/admin/instalacion/plist']);
    }
    

}
