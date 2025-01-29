import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { serverURL, httpOptions } from "../environment/environment";
import { IInstalacion } from "../model/instalacion.interface";
import { IPage } from "../model/model.interface";

@Injectable({
    providedIn: 'root'
  })
  export class InstalacionService {
  
  serverURL: string = serverURL + '/instalacion';
  
  constructor(private oHttp: HttpClient) {}
  
  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IInstalacion>> {
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
    return this.oHttp.get<IPage<IInstalacion>>(URL, httpOptions);
  }
  
  getPageXSocio(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_socio: number
  ): Observable<IPage<IInstalacion>> {
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
    return this.oHttp.get<IPage<IInstalacion>>(URL, httpOptions);
  }



  get(id: number): Observable<IInstalacion> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IInstalacion>(URL);
  }
  
  
  create(formData: FormData): Observable<IInstalacion> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IInstalacion>('http://localhost:8085/instalacion/new', formData);
  }
  
  update(oInstalacion: IInstalacion): Observable<IInstalacion> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.post<IInstalacion>(URL, oInstalacion);
  }
  
  getOne(id: number): Observable<IInstalacion> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/instalacion';
    URL += '/' + id;
    return this.oHttp.get<IInstalacion>('http://localhost:8085/instalacion/' + id);
  }
  
  delete(id: number) {
    return this.oHttp.delete('http://localhost:8085/instalacion/' + id);
  }
  
  
  
  }
  