import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { Subject, debounceTime } from 'rxjs';
import { IPage } from '../../../model/model.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInstalacion } from '../../../model/instalacion.interface';
import { InstalacionService } from '../../../service/instalacion.service';


@Component({
  selector: 'app-Instalacionselector',
  templateUrl: './instalacionselector.component.html',
  styleUrls: ['./instalacionselector.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InstalacionselectorComponent implements OnInit {
  oPage: IPage<IInstalacion> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 6;
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
  readonly dialogRef = inject(MatDialogRef<InstalacionselectorComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private oInstalacionService: InstalacionService,
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
    this.oInstalacionService
      .getInstalacionesDisponibles(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
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

  select(oInstalacion: IInstalacion) {
    console.log("Instalacion seleccionado antes de cerrar:", oInstalacion);
    this.dialogRef.close(oInstalacion);
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

  trackById(index: number, item: any): number {
    return item.id;  // Usamos el id para hacer el seguimiento de cada elemento
  }
  cerrar() {
    this.dialogRef.close(); // Cierra el modal sin pasar ningún dato
  }
  

}


