import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebContentStructureService {

  constructor(public http: HttpClient) { }

  apiUrl: string = `${environment.hostUrl}/${environment.webContentUri}`


  getWebContentStructures(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/sites/${environment.siteId}/content-structures?pageSize=-1`);
  }

}
