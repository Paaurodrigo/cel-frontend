import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ISocio } from '../../../model/socio.interface';
import { IPage } from '../../../model/model.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';
import { SocioService } from '../../../service/socio.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-instalacion.xsocio.admin.plist.routed',
  templateUrl: './instalacion.xsocio.admin.plist.routed.component.html',
  styleUrls: ['./instalacion.xsocio.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InstalacionXsocioAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<IInstalacion> | null = null;
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

  oSocio: ISocio = {} as ISocio;


  constructor(
    private oInstalacionService: InstalacionService,
    private oSocioService: SocioService,
    private oBotoneraService: BotoneraService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) {
    this.debounceSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.nPage = 0;
      this.getPage();
    });
 
    this.oActivatedRoute.params.subscribe((params) => {
      this.oSocioService.get(params['id']).subscribe({
        next: (oSocio: ISocio) => {
          this.oSocio = oSocio;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    });
  }

  ngOnInit() {
    this.getPage();
  }
  getPage() {
    this.oInstalacionService
      .getPageXSocio(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oSocio.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<IInstalacion>) => {
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

  edit(oInstalacion: IInstalacion) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/instalacion/edit/', oInstalacion.id]);
  }

  view(oInstalacion: IInstalacion) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/instalacion/view/', oInstalacion.id]);
  }

  remove(oInstalacion: IInstalacion) {
    this.oRouter.navigate(['admin/instalacion/delete/', oInstalacion.id]);
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
