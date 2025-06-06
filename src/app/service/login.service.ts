import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { httpOptions, serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  serverURL: string = serverURL + '/auth';

  constructor(private oHttp: HttpClient) { }

  login(email: string, password: string): Observable<string> {
    const loginData = { email: email, password: password};
    return this.oHttp.post<string>(this.serverURL + '/login', loginData);
  }

  solicitarRecuperacionPassword(email: string) {
    return this.oHttp.post<void>(
      `${this.serverURL}/recuperar-password`,
      JSON.stringify(email), // importante: convierte el string a JSON
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  restablecerPasswordConDni(id: number, dni: string, password: string) {
    return this.oHttp.post<void>(`${this.serverURL}/restablecer-password`, {
      id,
      dni,
      password
    });
  }
  
  

}

