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


get(id: number): Observable<IInmueble> {
  let URL: string = '';
  URL += this.serverURL;
  URL += '/' + id;
  return this.oHttp.get<IInmueble>(URL);
}


create(formData: FormData): Observable<IInmueble> {
  let URL: string = '';
  URL += this.serverURL;
  return this.oHttp.put<IInmueble>('http://localhost:8085/inmueble/new', formData);
}

update(oinmueble: IInmueble): Observable<IInmueble> {
  let URL: string = '';
  URL += this.serverURL;
  return this.oHttp.post<IInmueble>(URL, oinmueble);
}

getOne(id: number): Observable<IInmueble> {
  let URL: string = '';
  URL += 'http://localhost:8085';
  URL += '/inmueble';
  URL += '/' + id;
  return this.oHttp.get<IInmueble>('http://localhost:8085/inmueble/' + id);
}

delete(id: number) {
  return this.oHttp.delete('http://localhost:8085/inmueble/' + id);
}

getInmueblesSinSocio(): Observable<IInmueble[]> {
  return this.oHttp.get<IInmueble[]>('http://localhost:8085/inmueble/sin-socio');
}

update1(oInmueble: IInmueble): Observable<IInmueble> {
  return this.oHttp.put<IInmueble>('http://localhost:8085/inmueble/' + oInmueble.id, oInmueble);
}



}
