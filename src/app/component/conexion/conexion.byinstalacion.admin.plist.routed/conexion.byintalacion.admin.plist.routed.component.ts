import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { IConexion } from '../../../model/conexion.interface';
import { IPage } from '../../../model/model.interface';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { BotoneraService } from '../../../service/botonera.service';
import { ConexionService } from '../../../service/conexion.service';

@Component({
  selector: 'app-conexion.byinstalacion.admin.plist.routed',
  templateUrl: './conexion.byintalacion.admin.plist.routed.component.html',
  styleUrls: ['./conexion.byintalacion.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ConexionByInstalacionAdminPlistRoutedComponent implements OnInit {

  
   
  oPage: IPage<IConexion> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = '';

  id_instalacion:number=0
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();
  constructor(
    private oConexionService: ConexionService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
  }

  ngOnInit() {
    this.id_instalacion = Number(this.oActivatedRoute.snapshot.paramMap.get('id'));
    console.log('ID Instalación:', this.id_instalacion);
    this.getPage();
  }

  getPage() {
    // O como tengas la referencia a la instalación
    console.log('ID Instalación en getPage:', this.id_instalacion);

    this.oConexionService
      .getPageXInstalacion(
        this.nPage,       // Página
        this.nRpp,        // Número de resultados por página
        this.strField,    // Campo para ordenar
        this.strDir,      // Dirección de orden (asc/desc)
        this.strFiltro,   // Filtro de búsqueda
        this.id_instalacion    // Aquí pasas el id_instalacion
      )
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