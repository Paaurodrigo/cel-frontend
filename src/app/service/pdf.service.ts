import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  serverURL: string = serverURL + '/api/pdf/generate';
  constructor(private http: HttpClient) {}

  downloadPdf(instalacionId: number): Observable<Blob> {
    return this.http.get(`${this.serverURL}/${instalacionId}`, { responseType: 'blob' });
  }
}
