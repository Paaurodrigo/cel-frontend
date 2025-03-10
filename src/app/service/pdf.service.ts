import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://localhost:8085/api/pdf/generate';

  constructor(private http: HttpClient) {}

  downloadPdf(instalacionId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${instalacionId}`, { responseType: 'blob' });
  }
}
