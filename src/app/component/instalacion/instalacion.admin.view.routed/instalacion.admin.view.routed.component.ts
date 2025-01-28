import { Component, OnInit } from '@angular/core';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-instalacion.admin.view.routed',
  templateUrl: './instalacion.admin.view.routed.component.html',
  styleUrls: ['./instalacion.admin.view.routed.component.css']
})
export class InstalacionAdminViewRoutedComponent implements OnInit {
  id: number = 0;
  oInstalacion: IInstalacion = {} as IInstalacion;

  constructor(private oActivatedRoute: ActivatedRoute, private oInstalacionService: InstalacionService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
   
    
  }

  getOne() {
    this.oInstalacionService.getOne(this.id).subscribe({
      next: (data: IInstalacion) => {
        this.oInstalacion = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos del Instalacion', err);
      }
    });
  }


}
