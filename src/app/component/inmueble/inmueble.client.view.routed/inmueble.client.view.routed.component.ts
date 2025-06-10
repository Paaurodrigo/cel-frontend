import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inmueble.client.view.routed',
  templateUrl: './inmueble.client.view.routed.component.html',
  styleUrls: ['./inmueble.client.view.routed.component.css'],
  imports: [
    CommonModule
  ],
  standalone: true
})
export class InmuebleClientViewRoutedComponent implements OnInit {

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
