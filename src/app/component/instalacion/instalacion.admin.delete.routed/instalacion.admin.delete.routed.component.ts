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
  confirmMessage: string = '';
  confirmModal: any;
  
  oInstalacion: IInstalacion | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oInstalacionService: InstalacionService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) { }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oInstalacionService.get(id).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
      },
      error: () => {
        this.showModal('Error al cargar la instalación');
      },
    });
  }
  // Muestra el modal de confirmación personalizado
showConfirmModal(mensaje: string) {
  this.confirmMessage = mensaje;
  this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
    keyboard: false,
  });
  this.confirmModal.show();
}

// Cierra el modal de confirmación sin hacer nada
closeConfirmModal() {
  this.confirmModal.hide();
}

// Si el usuario confirma, elimina la instalación forzando
confirmDelete() {
  this.closeConfirmModal(); // Cierra el modal antes de proceder
  this.deleteInstalacionForce(); // Llama al método que elimina con force=true
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
    this.oRouter.navigate(['/admin/instalacion/plist']);
  }

  deleteInstalacion(): void {
    this.oInstalacionService.delete(this.oInstalacion!.id).subscribe({
      next: () => {
        this.showModal(
          'La instalación ' + this.oInstalacion!.nombre + ' ha sido borrada correctamente.'
        );
      },
      error: (error) => {
        if (error.status === 409) {
          // Si hay conexiones asociadas, preguntamos confirmación con otro modal de Bootstrap
          if (confirm('La instalación tiene conexiones con inmuebles. ¿Estás seguro de que quieres eliminarla junto con sus conexiones?')) {
            this.deleteInstalacionForce();
          } else {
            this.showModal('Operación cancelada por el usuario.');
          }
        } else {
          this.showModal('Error al borrar la instalación');
        }
      },
    });
  }

  deleteInstalacionForce(): void {
    this.oInstalacionService.delete(this.oInstalacion!.id, true).subscribe({
      next: () => {
        this.showModal(
          'La instalación ' + this.oInstalacion!.nombre + ' y sus conexiones han sido eliminadas correctamente.'
        );
      },
      error: () => {
        this.showModal('Error al borrar la instalación y sus conexiones.');
      },
    });
  }
}
