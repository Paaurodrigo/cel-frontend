import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { Subject, debounceTime } from 'rxjs';
import { IPage } from '../../../model/model.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInmueble } from '../../../model/inmueble.interface';
import { InmuebleService } from '../../../service/inmueble.service';


@Component({
  selector: 'app-Inmuebleselector',
  templateUrl: './inmuebleselector.component.html',
  styleUrls: ['./inmuebleselector.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class InmuebleselectorComponent implements OnInit {
  oPage: IPage<IInmueble> | null = null;
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
  readonly dialogRef = inject(MatDialogRef<InmuebleselectorComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private oInmuebleService: InmuebleService,
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
    this.oInmuebleService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
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

  select(oInmueble: IInmueble) {
    console.log("Inmueble seleccionado antes de cerrar:", oInmueble);
    this.dialogRef.close(oInmueble);
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


