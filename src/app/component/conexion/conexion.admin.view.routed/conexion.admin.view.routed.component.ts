import { Component, OnInit } from '@angular/core';
import { IConexion } from '../../../model/conexion.interface';
import { ConexionService } from '../../../service/conexion.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conexion.admin.view.routed',
  templateUrl: './conexion.admin.view.routed.component.html',
  styleUrls: ['./conexion.admin.view.routed.component.css'],
  imports:[ RouterModule, CommonModule],
  standalone: true
})
export class ConexionAdminViewRoutedComponent implements OnInit {
  id: number = 0;
  route: string = '';
  titulo: string = '';
  oConexion: IConexion = {} as IConexion;
  
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oConexionService: ConexionService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }
getOne() {
    this.oConexionService.getOne(this.id).subscribe({
      next: (data: IConexion) => {
        this.oConexion = data;
      },
    });
  }
}
