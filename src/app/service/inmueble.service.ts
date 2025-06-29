import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { IInmueble } from '../model/inmueble.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InmuebleService {

serverURL: string = serverURL + '/inmueble';

constructor(private oHttp: HttpClient) {}

getPage(
  page: number,
  size: number,
  field: string,
  dir: string,
  filtro: string
): Observable<IPage<IInmueble>> {
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
  return this.oHttp.get<IPage<IInmueble>>(URL, httpOptions);
}

getPageXSocio(
  page: number,
  size: number,
  field: string,
  dir: string,
  filtro: string,
  id_socio: number
): Observable<IPage<IInmueble>> {
  let URL: string = '';
  URL += this.serverURL + '/xsocio/' + id_socio;
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
  return this.oHttp.get<IPage<IInmueble>>(URL, httpOptions);
}

getPageXInstalacion(
  page: number,
  size: number,
  field: string,
  dir: string,
  filtro: string,
  instalacion: number
): Observable<IPage<IInmueble>> {
  let URL: string = '';
  URL += this.serverURL + '/xinstalacion/' + instalacion;
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
  return this.oHttp.get<IPage<IInmueble>>(URL, httpOptions);
}


get(id: number): Observable<IInmueble> {
  let URL: string = '';
  URL += this.serverURL;
  URL += '/' + id;
  return this.oHttp.get<IInmueble>(URL);
}


create(formData: FormData): Observable<IInmueble> {
  let URL: string = '';
  URL += this.serverURL;
  return this.oHttp.put<IInmueble>(this.serverURL + '/new', formData);
}

update(oinmueble: IInmueble): Observable<IInmueble> {
  let URL: string = '';
  URL += this.serverURL;
  return this.oHttp.post<IInmueble>(URL, oinmueble);
}

getOne(id: number): Observable<IInmueble> {
  let URL: string = '';
  
  return this.oHttp.get<IInmueble>(this.serverURL + '/' + id);
}



delete(id: number, force: boolean = false) {
  const options = force ? { params: { force: 'true' } } : {};
  return this.oHttp.delete(this.serverURL + '/' + id, options);
}

getInmueblesSinSocio(): Observable<IInmueble[]> {
  return this.oHttp.get<IInmueble[]>(this.serverURL + '/sin-socio');
}

update1(oInmueble: IInmueble): Observable<IInmueble> {
  return this.oHttp.put<IInmueble>(this.serverURL + '/' + oInmueble.id, oInmueble);
}

checkCupsExists(cups: string): Observable<boolean> {
  const url = `${this.serverURL}/check-cups?cups=${encodeURIComponent(cups)}`;
  return this.oHttp.get<boolean>(url);
}


}
