import { Component, OnInit } from '@angular/core';
import { IInmueble } from '../../../model/inmueble.interface';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IPage } from '../../../model/model.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InmuebleService } from '../../../service/inmueble.service';
import { InstalacionService } from '../../../service/instalacion.service';

@Component({
  selector: 'app-inmueble.xinstalacion.admin.plist.routed',
  templateUrl: './inmueble.xinstalacion.admin.plist.routed.component.html',
  styleUrls: ['./inmueble.xinstalacion.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InmuebleXinstalacionAdminPlistRoutedComponent implements OnInit {
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
  //
  private debounceSubject = new Subject<string>();
  //
  oInstalacion: IInstalacion = {} as IInstalacion;
  //
  id_Instalacion: number = 0;




  constructor(
    private oInmuebleService: InmuebleService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oInstalacionService: InstalacionService
  ) {
    this.debounceSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.getPage();
    });

    // recollir el paràmetre de la URL Instalacion
    this.id_Instalacion = this.oActivatedRoute.snapshot.params['id'];
    this.oInstalacionService.get(this.id_Instalacion).subscribe({
      next: (oInstalacion: IInstalacion) => {
        this.oInstalacion = oInstalacion;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oInmuebleService
      .getPageXInstalacion(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro, this.id_Instalacion)
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

  edit(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/inmueble/edit', oInmueble.id]);
  }

  view(oInmueble: IInmueble) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/inmueble/view', oInmueble.id]);
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
}
