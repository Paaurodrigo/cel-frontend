import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions, serverURL } from '../environment/environment';
import { IConexion } from '../model/conexion.interface';

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
}

