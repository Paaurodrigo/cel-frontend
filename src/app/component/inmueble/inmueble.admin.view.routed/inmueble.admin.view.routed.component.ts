import { Component, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InmuebleService } from '../../../service/inmueble.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inmueble.admin.view.routed',
  templateUrl: './inmueble.admin.view.routed.component.html',
  styleUrls: ['./inmueble.admin.view.routed.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class InmuebleAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  oInmueble: IInmueble = {} as IInmueble;

  constructor(private oActivatedRoute: ActivatedRoute, private oInmuebleService: InmuebleService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
   
    
  }
  getUsoIcon(uso: string): string {
    const icons: { [key: string]: string } = {
      residencial: 'bi-house-door',
      comercial: 'bi-shop',
      industrial: 'bi-buildings',
    };
    return icons[uso] || 'bi-question-circle';
  }

  getUsoBadgeClass(uso: string): string {
    const classes: { [key: string]: string } = {
      residencial: 'bg-success text-white',
      comercial: 'bg-warning text-dark',
      industrial: 'bg-info text-dark',
    };
    return classes[uso] || 'bg-secondary text-white'; // Valor por defecto
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
