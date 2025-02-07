import { Injectable } from '@angular/core';
import { ITipoSocio } from '../model/tipoSocio.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL, httpOptions } from '../environment/environment';
import { IPage } from '../model/model.interface';

@Injectable({
  providedIn: 'root'
})
export class TiposocioService {

  serverURL: string = serverURL + '/tipoSocio';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ITipoSocio>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ITipoSocio>>(URL, httpOptions);
  }

  get(id: number): Observable<ITipoSocio> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ITipoSocio>(URL);
  }

  create(oTipoITipoSocio: ITipoSocio): Observable<ITipoSocio> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ITipoSocio>(URL, oTipoITipoSocio);
  }

  update(oTipoITipoSocio: ITipoSocio): Observable<ITipoSocio> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ITipoSocio>(URL, oTipoITipoSocio);
  }

  getOne(id: number): Observable<ITipoSocio> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ITipoSocio>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete(this.serverURL + '/' + id);
  }
}
