import { Component, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { ActivatedRoute } from '@angular/router';
import { InmuebleService } from '../../../service/inmueble.service';

@Component({
  selector: 'app-inmueble.admin.view.routed',
  templateUrl: './inmueble.admin.view.routed.component.html',
  styleUrls: ['./inmueble.admin.view.routed.component.css']
})
export class InmuebleAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  oInmueble: IInmueble = {} as IInmueble;

  constructor(private oActivatedRoute: ActivatedRoute, private oInmuebleService: InmuebleService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
   
    
  }

  getOne() {
    this.oInmuebleService.getOne(this.id).subscribe({
      next: (data: IInmueble) => {
        this.oInmueble = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos del Inmueble', err);
      }
    });
  }

}
