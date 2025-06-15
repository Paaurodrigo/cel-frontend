import { Component, OnInit } from '@angular/core';
import { IInstalacion } from '../../../model/instalacion.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IPage } from '../../../model/model.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { InstalacionService } from '../../../service/instalacion.service';

@Component({
  selector: 'app-instalacion.admin.plist.routed',
  templateUrl: './instalacion.admin.plist.routed.component.html',
  styleUrls: ['./instalacion.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InstalacionAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<IInstalacion> | null = null;
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

  constructor( private oInstalacionService: InstalacionService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router) { this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });}

 
  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oInstalacionService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
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

  view(oInstalacion: IInstalacion) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/instalacion/view', oInstalacion.id]);
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

  getPotenciaClass(disponible: number, total: number): string {
    if (disponible === 0) {
      return 'bg-danger text-white'; // Rojo
    } else if (disponible < total / 2) {
      return 'bg-warning text-dark'; // Naranja
    } else {
      return 'bg-info-subtle text-info'; // Azul
    }
  }
  

}
