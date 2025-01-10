import { Component, OnInit } from '@angular/core';
import { ISocio } from '../../../model/socio.interface';
import { ActivatedRoute } from '@angular/router';
import { SocioService } from '../../../service/socio.service';

@Component({
  selector: 'app-socio.admin.view.routed',
  templateUrl: './socio.admin.view.routed.component.html',
  styleUrls: ['./socio.admin.view.routed.component.css']
})
export class SocioAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  oSocio: ISocio = {} as ISocio;
  fotoDniBase64: string | undefined;

  constructor(private oActivatedRoute: ActivatedRoute, private oSocioService: SocioService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }

  getOne() {
    this.oSocioService.getOne(this.id).subscribe({
      next: (data: ISocio) => {
        this.oSocio = data;
        // Verifica que la foto en base64 está siendo recibida correctamente
        console.log('Foto base64:', data.fotoDni);
  
        if (data.fotoDni) {
          this.fotoDniBase64 = 'data:image/png;base64,' + data.fotoDni;
          console.log('Foto en base64 convertida:', this.fotoDniBase64);  // Verifica que la cadena está bien formateada
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos del socio', err);
      }
    });
  }
}