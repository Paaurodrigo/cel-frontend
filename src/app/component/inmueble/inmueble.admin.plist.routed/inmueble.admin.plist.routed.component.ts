import { Component, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { IPage } from '../../../model/model.interface';
import { debounceTime, Subject } from 'rxjs';
import { InmuebleService } from '../../../service/inmueble.service';
import { BotoneraService } from '../../../service/botonera.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../../pipe/trim.pipe';

@Component({
  selector: 'app-inmueble.admin.plist.routed',
  templateUrl: './inmueble.admin.plist.routed.component.html',
  styleUrls: ['./inmueble.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InmuebleAdminPlistRoutedComponent implements OnInit {

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
  private debounceSubject = new Subject<string>();

  constructor( private oInmuebleService: InmuebleService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router) {  this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });}

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oInmuebleService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
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
    this.oRouter.navigate(['admin/inmueble/view', oInmueble.id]);
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


