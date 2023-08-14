import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebContentStructureService {

  httpOptions = {headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa(`${environment.userEmail}:${environment.userPassword}`)
  })}


  constructor(public http: HttpClient) { }


  getWebContentStructures(): Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/sites/${environment.siteId}/content-structures`, this.httpOptions);
  }

}
