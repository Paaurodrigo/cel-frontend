import { Component, OnInit } from '@angular/core';
import { ISocio } from '../../../model/socio.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SocioService } from '../../../service/socio.service';

@Component({
  selector: 'app-socio.admin.view.routed',
  templateUrl: './socio.admin.view.routed.component.html',
  styleUrls: ['./socio.admin.view.routed.component.css'],
  imports: [RouterLink],
  standalone: true
})
export class SocioAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  oSocio: ISocio = {} as ISocio;
  fotoDni: string | undefined;
  modalImage: string = '';

  constructor(private oActivatedRoute: ActivatedRoute, private oSocioService: SocioService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
    this.verImagen(this.id);
  }

  verImagen(id: number): void {
    this.oSocioService.getFotoDni(id).subscribe({
      next: (blob: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.fotoDni = reader.result as string;
        };
        reader.readAsDataURL(blob);
    },
    error: (err) => {
      console.error('Error al obtener la foto del socio', err);
      this.fotoDni = undefined;
    },
  });
  
    
  }
  getOne() {
    this.oSocioService.getOne(this.id).subscribe({
      next: (data: ISocio) => {
        this.oSocio = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos del socio', err);
      }
    });
  }

 
  
}