import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  serverURL: string = serverURL + '/api/generate';
  constructor(private http: HttpClient) {}

  downloadPdf(instalacionId: number): Observable<Blob> {
    return this.http.get(`${this.serverURL}/pdf/${instalacionId}`, { responseType: 'blob' });
  }

  downloadTxt(instalacionId: number): Observable<Blob> {
    const url = `${this.serverURL}/txt/${instalacionId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  
}
