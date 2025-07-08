// src/app/services/fichas-bibliograficas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FichaBibliografica } from '../interfaces/libros';

@Injectable({
  providedIn: 'root'
})
export class FichasBibliograficasService {
  private apiUrl = 'http://localhost:8085/api/fichas'; // Adjust if your backend runs on a different port

  constructor(private http: HttpClient) { }

  getAllFichas(): Observable<FichaBibliografica[]> {
    return this.http.get<FichaBibliografica[]>(this.apiUrl);
  }

  getFichaById(id: number): Observable<FichaBibliografica> {
    return this.http.get<FichaBibliografica>(`${this.apiUrl}/${id}`);
  }

  getFichasByEstado(estado: boolean): Observable<FichaBibliografica[]> {
    return this.http.get<FichaBibliografica[]>(`${this.apiUrl}/estado/${estado}`);
  }

  createFicha(ficha: FichaBibliografica): Observable<FichaBibliografica> {
    return this.http.post<FichaBibliografica>(this.apiUrl, ficha);
  }

  updateFicha(id: number, ficha: FichaBibliografica): Observable<FichaBibliografica> {
    return this.http.put<FichaBibliografica>(`${this.apiUrl}/${id}`, ficha);
  }

  deleteFicha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  restoreFicha(id: number): Observable<FichaBibliografica> {
    return this.http.put<FichaBibliografica>(`${this.apiUrl}/restore/${id}`, {});
  }

  getPdfReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf`, { responseType: 'blob' });
  }
}