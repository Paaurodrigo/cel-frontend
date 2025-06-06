import { Injectable } from '@angular/core';
import { ISocio } from '../model/socio.interface';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../model/model.interface';
import { httpOptions, serverURL } from '../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class SocioService {
  serverURL: string = serverURL + '/socio';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ISocio>> {
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
    return this.oHttp.get<IPage<ISocio>>(URL, httpOptions);
  }

  get(id: number): Observable<ISocio> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ISocio>(URL);
  }


  create(formData: FormData): Observable<ISocio> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ISocio>(this.serverURL+'/new', formData);
  }

  createbyAdmin(formData: FormData): Observable<ISocio> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ISocio>(this.serverURL+'/new/byadmin', formData);
  }

  update(oSocio: ISocio): Observable<ISocio> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.post<ISocio>(URL, oSocio);
  }

  getOne(id: number): Observable<ISocio> {
    let URL: string = '';
    return this.oHttp.get<ISocio>(this.serverURL+'/' + id);
  }

  delete(id: number) {
    return this.oHttp.delete(this.serverURL+'/' + id);
  }

  getFotoDni(id: number): Observable<Blob> {
    return this.oHttp.get(this.serverURL+'/'+id+'/image', { responseType: 'blob' });
  }

  getSocioByEmail(email: string): Observable<ISocio> {
    let URL: string = '';
    URL += this.serverURL + '/byemail';
    URL += '/' + email;
    return this.oHttp.get<ISocio>(URL);
  }

  // En socio.service.ts (simplificado)
  checkEmailExists(email: string): Observable<boolean> {
    const url = `${this.serverURL}/check-email?email=${encodeURIComponent(email)}`;
    return this.oHttp.get<boolean>(url);
  }
  
  checkDniExists(dni: string): Observable<boolean> {
    const url = `${this.serverURL}/check-dni?dni=${encodeURIComponent(dni)}`;
    return this.oHttp.get<boolean>(url);
  }
  

 
  

}
