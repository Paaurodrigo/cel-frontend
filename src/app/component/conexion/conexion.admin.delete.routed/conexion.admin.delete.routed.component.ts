import { Component, OnInit } from '@angular/core';
import { IConexion } from '../../../model/conexion.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConexionService } from '../../../service/conexion.service';
import { CommonModule } from '@angular/common';
declare let bootstrap: any;
@Component({
  selector: 'app-conexion.admin.delete.routed',
  templateUrl: './conexion.admin.delete.routed.component.html',
  styleUrls: ['./conexion.admin.delete.routed.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class ConexionAdminDeleteRoutedComponent implements OnInit {
  oConexion: IConexion | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oConexionService: ConexionService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) {}

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oConexionService.get(id).subscribe({
      next: (oConexion: IConexion) => {
        this.oConexion = oConexion;
      },
      error: (err) => {
        this.showModal('Error al cargar el Conexion');
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

  delete(): void {
    this.oConexionService.delete(this.oConexion!.id).subscribe({
      next: (data) => {
        this.showModal(
          'Conexion borrada'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el Conexion');
      },
    });
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/conexion/plist']);
  }
  
}