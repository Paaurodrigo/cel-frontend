import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ISocio } from '../../model/socio.interface';
import { SocioService } from '../../service/socio.service';


@Component({
  selector: 'app-shared.byemail.routed',
  templateUrl: './shared.byemail.routed.component.html',
  styleUrls: ['./shared.byemail.routed.component.css']
})
export class SharedByemailRoutedComponent implements OnInit {

  email: string = "";
  oSocio: ISocio = {} as ISocio;
  fotoDni: string | undefined;
  modalImage: string = '';

  constructor(private oActivatedRoute: ActivatedRoute, private oSocioService: SocioService) { }

  ngOnInit() {
    this.email = this.oActivatedRoute.snapshot.params['email'];
    this.getOne();
  }
    
  
  getOne() {
    this.oSocioService.getSocioByEmail(this.email).subscribe({
      next: (data: ISocio) => {
        this.oSocio = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos del Socio', err);
      }
    });
  }

}
