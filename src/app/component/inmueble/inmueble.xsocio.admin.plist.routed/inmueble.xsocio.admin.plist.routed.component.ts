import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IInmueble } from '../../../model/inmueble.interface';
import { IPage } from '../../../model/model.interface';
import { ISocio } from '../../../model/socio.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { InmuebleService } from '../../../service/inmueble.service';
import { SocioService } from '../../../service/socio.service';

@Component({
  selector: 'app-inmueble.xsocio.admin.plist.routed',
  templateUrl: './inmueble.xsocio.admin.plist.routed.component.html',
  styleUrls: ['./inmueble.xsocio.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InmuebleXsocioAdminPlistRoutedComponent implements OnInit {

  oPage: IPage<IInmueble> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];

  oInmueblesSinSocio: IInmueble[] = [];
  bMostrarDesplegable: boolean = false;
  inmuebleSeleccionado: IInmueble | null = null;


  //
  private debounceSubject = new Subject<string>();

  oSocio: ISocio = {} as ISocio;

  constructor(
    private oInmuebleService: InmuebleService,
    private oSocioService: SocioService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute
  ) {
    this.debounceSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.nPage = 0;
      this.getPage();
    });
    // get id from route admin/Inmueble/plist/xSocio/:id
    this.oActivatedRoute.params.subscribe((params) => {
      const socioId = params['id'];
      console.log("ID del socio obtenido de la URL:", socioId); // 👀 Verificar si el ID es correcto
    
      if (!socioId) {
        console.error("Error: El ID del socio no está en la URL.");
        return;
      }
    
      this.oSocioService.get(socioId).subscribe({
        next: (oSocio: ISocio) => {
          console.log("Socio recibido del backend:", oSocio); // 👀 Ver si el backend devuelve un socio correcto
          this.oSocio = oSocio;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.error("Error al obtener el socio:", err);
        },
      });
    });
    
   }

   ngOnInit() {
    this.getPage();
  }

  getPage() {
    console.log("Obteniendo inmuebles para el socio con ID:", this.oSocio.id);
  
    this.oInmuebleService
      .getPageXSocio(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oSocio.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<IInmueble>) => {
          console.log("Inmuebles recibidos del backend:", oPageFromServer); // 👀 Ver si devuelve los inmuebles
          this.oPage = oPageFromServer;
        },
        error: (err) => {
          console.error("Error al obtener los inmuebles:", err);
        },
      });
  }
  

  edit(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/inmueble/edit/', oInmueble.id]);
  }

  view(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/inmueble/view/', oInmueble.id]);
  }

  remove(oInmueble: IInmueble) {
    this.oRouter.navigate(['admin/inmueble/delete/', oInmueble.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }

  getInmueblesSinSocio() {
    this.oInmuebleService.getInmueblesSinSocio().subscribe({
      next: (inmuebles: IInmueble[]) => {
        this.oInmueblesSinSocio = inmuebles;
        this.bMostrarDesplegable = true; // Mostrar el desplegable
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  

  asignarInmueble() {
    const socioId = this.oSocio.id; // Asegurar que tenemos el ID del socio
  
    if (!this.inmuebleSeleccionado || !socioId) {
      console.error("Error: No se puede asignar, datos inválidos.");
      return;
    }
  
    // Si el inmueble no tiene socio, lo inicializamos
    if (!this.inmuebleSeleccionado.socio) {
      this.inmuebleSeleccionado.socio = {} as ISocio;
    }
  
    this.inmuebleSeleccionado.socio.id = socioId; // Asignamos el ID del socio correctamente
    this.oInmuebleService.update(this.inmuebleSeleccionado).subscribe({
      next: () => {
        this.bMostrarDesplegable = false;
        this.getPage();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  
  
  
  

}
