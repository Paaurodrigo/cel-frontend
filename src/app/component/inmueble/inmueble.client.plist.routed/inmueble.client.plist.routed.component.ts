import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IInmueble } from '../../../model/inmueble.interface';
import { IPage } from '../../../model/model.interface';
import { ISocio } from '../../../model/socio.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { InmuebleService } from '../../../service/inmueble.service';
import { SocioService } from '../../../service/socio.service';
import { SessionService } from '../../../service/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../../pipe/trim.pipe';

@Component({
  selector: 'app-inmueble.client.plist.routed',
  templateUrl: './inmueble.client.plist.routed.component.html',
  styleUrls: ['./inmueble.client.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InmuebleClientPlistRoutedComponent implements OnInit {

  oPage: IPage<IInmueble> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = '';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
 socioId:number=0;
//

oSocio: ISocio = {} as ISocio;

  private debounceSubject = new Subject<string>();

  constructor( private oInmuebleService: InmuebleService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oSessionService: SessionService
  ) {  this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });}

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.socioId = Number(this.oSessionService.getSessionId());
    this.oInmuebleService
      .getPageXSocio(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro,this.socioId)
      .subscribe({
        next: (oPageFromServer: IPage<IInmueble>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
 
  }

  view(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['client/inmueble/view/', oInmueble.id]);
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



}


