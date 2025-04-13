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
  confirmMessage: string = '';
  myModal: any;
  confirmModal: any;

  constructor(
    private oInmuebleService: InmuebleService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) { }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oInmuebleService.get(id).subscribe({
      next: (oInmueble: IInmueble) => {
        this.oInmueble = oInmueble;
      },
      error: () => {
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

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/inmueble/plist']);
  }

  showConfirmModal(mensaje: string) {
    this.confirmMessage = mensaje;
    this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
      keyboard: false,
    });
    this.confirmModal.show();
  }

  closeConfirmModal() {
    this.confirmModal.hide();
  }

  confirmDelete() {
    this.closeConfirmModal();
    this.deleteInmuebleForce();
  }

  deleteInmueble(): void {
    this.oInmuebleService.delete(this.oInmueble!.id).subscribe({
      next: () => {
        this.showModal('Inmueble con CUPS ' + this.oInmueble!.cups + ' ha sido borrado.');
      },
      error: (error) => {
        if (error.status === 409) {
          this.showConfirmModal('El inmueble está conectado a una instalación. ¿Estás seguro de que quieres eliminarlo junto con sus conexiones?');
        } else {
          this.showModal('Error al borrar el Inmueble.');
        }
      },
    });
  }

  deleteInmuebleForce(): void {
    this.oInmuebleService.delete(this.oInmueble!.id, true).subscribe({
      next: () => {
        this.showModal('El inmueble y sus conexiones han sido eliminados correctamente.');
      },
      error: () => {
        this.showModal('Error al eliminar el inmueble y sus conexiones.');
      },
    });
  }
}
