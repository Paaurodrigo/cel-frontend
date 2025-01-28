import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';



declare let bootstrap: any;

@Component({
  selector: 'app-inmueble.admin.delete.routed',
  templateUrl: './inmueble.admin.delete.routed.component.html',
  styleUrls: ['./inmueble.admin.delete.routed.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class InmuebleAdminDeleteRoutedComponent implements OnInit {
  oInmueble: IInmueble | null = null;
  strMessage: string = '';
  myModal: any;
  constructor(private oInmuebleService: InmuebleService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router) { }

    ngOnInit(): void {
      let id = this.oActivatedRoute.snapshot.params['id'];
      this.oInmuebleService.get(id).subscribe({
        next: (oInmueble: IInmueble) => {
          this.oInmueble = oInmueble;
        },
        error: (err) => {
          this.showModal('Error al cargar el inmueble');
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
  
    deleteInmueble(): void {
      this.oInmuebleService.delete(this.oInmueble!.id).subscribe({
        next: (data) => {
          this.showModal(
            'Inmueble con cups ' + this.oInmueble!.cups + ' ha sido borrado'
          );
        },
        error: (error) => {
          this.showModal('Error al borrar el Inmueble');
        },
      });
    }
  
    hideModal = () => {
      this.myModal.hide();
      this.oRouter.navigate(['/admin/inmueble/plist']);
    }
    

}
