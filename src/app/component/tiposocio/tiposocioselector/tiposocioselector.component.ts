import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipoSocio } from '../../../model/tipoSocio.interface';
import { Subject, debounceTime } from 'rxjs';
import { IPage } from '../../../model/model.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { TiposocioService } from '../../../service/tiposocio.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tiposocioselector',
  templateUrl: './tiposocioselector.component.html',
  styleUrls: ['./tiposocioselector.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class TiposocioselectorComponent implements OnInit {
  oPage: IPage<ITipoSocio> | null = null;
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
  readonly dialogRef = inject(MatDialogRef<TiposocioselectorComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private oTipoSocioService: TiposocioService,
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
        this.oTipoSocioService
          .getPage(
            this.nPage,
            this.nRpp,
            this.strField,
            this.strDir,
            this.strFiltro
          )
          .subscribe({
            next: (oPageFromServer: IPage<ITipoSocio>) => {
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
    
     
    
      select(oTipoSocio: ITipoSocio) {
        console.log("Tipo de socio seleccionado antes de cerrar:", oTipoSocio);
        this.dialogRef.close(oTipoSocio); 
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

  
    