import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions, serverURL } from '../environment/environment';
import { IConexion } from '../model/conexion.interface';
import { IPage } from '../model/model.interface';

@Injectable({
  providedIn: 'root'
})

export class ConexionService {

    serverURL: string = serverURL + '/conexion';

    constructor(private oHttp: HttpClient) {}



    create(formData: FormData): Observable<IConexion> {
      let URL: string = '';
      URL += this.serverURL;
      return this.oHttp.put<IConexion>('http://localhost:8085/conexion/new', formData);
    }

    create1(oConexion: IConexion): Observable<IConexion> {
      const URL: string = `${serverURL}/conexion/new`; 
      return this.oHttp.post<IConexion>(URL, oConexion, httpOptions);
    }

    getPage(
      page: number,
      size: number,
      field: string,
      dir: string,
      filtro: string
    ): Observable<IPage<IConexion>> {
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
      return this.oHttp.get<IPage<IConexion>>(URL, httpOptions);
    }

    getPageXInstalacion(
      page: number,
      size: number,
      field: string,
      dir: string,
      filtro: string,
      id_instalacion: number
    ): Observable<IPage<IConexion>> {
      let URL: string = '';
      URL += this.serverURL + '/by-instalacion';
    
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
    
      if (id_instalacion) {
        URL += '&id_instalacion=' + id_instalacion;
      }
    
      console.log('Llamando al servidor con URL:', URL);
      
      return this.oHttp.get<IPage<IConexion>>(URL, httpOptions);
    }
    
    
    update(oConexion: IConexion): Observable<IConexion> {
      let URL: string = '';
      URL += this.serverURL;
      return this.oHttp.put<IConexion>(URL, oConexion);
    }
  
    getOne(id: number): Observable<IConexion> {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/' + id;
      return this.oHttp.get<IConexion>(URL);
    }
  
    delete(id: number) {
      return this.oHttp.delete(this.serverURL + '/' + id);
    }
    get(id: number): Observable<IConexion> {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/' + id;
      return this.oHttp.get<IConexion>(URL);
    }
}

