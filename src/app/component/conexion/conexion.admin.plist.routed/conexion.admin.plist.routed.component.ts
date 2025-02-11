import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IConexion } from '../../../model/conexion.interface';
import { IPage } from '../../../model/model.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { ConexionService } from '../../../service/conexion.service';

@Component({
  selector: 'app-conexion.admin.plist.routed',
  templateUrl: './conexion.admin.plist.routed.component.html',
  styleUrls: ['./conexion.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ConexionAdminPlistRoutedComponent implements OnInit {

   
  oPage: IPage<IConexion> | null = null;
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
  constructor(
    private oConexionService: ConexionService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oConexionService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<IConexion>) => {
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


  view(oConexion: IConexion) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/conexion/view', oConexion.id]);
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