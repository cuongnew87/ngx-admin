
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {

  private readonly baseUrl =
    `${environment.beUrl}/template`;

  constructor(
    private http: HttpClient
  ) {
  }

  getVersions(): Observable<string[]> {

    return this.http.get<string[]>(
      `${this.baseUrl}/versions`
    );
  }

  getTemplate(version: string): Observable<string> {

    return this.http.get(
      `${this.baseUrl}/${version}`,
      {
        responseType: 'text'
      }
    );
  }

  generateYaml(
    body: any
  ): Observable<Blob> {

    return this.http.post(
      `${environment.beUrl}/generate/convert`,
      body,
      {
        responseType: 'blob'
      }
    );
  }
}