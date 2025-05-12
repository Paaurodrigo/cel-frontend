import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = 'http://localhost:8080/auth'; // Cambia por tu backend si es necesario

  constructor(private http: HttpClient) {}

  enviarCorreoRecuperacion(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/recuperar-password`, JSON.stringify(email), { headers });
  }
}
