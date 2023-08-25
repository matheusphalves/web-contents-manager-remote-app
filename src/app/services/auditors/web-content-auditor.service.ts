import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebContentHistoric } from 'src/app/models/WebContentHistoric';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebContentAuditorService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({ "Content-Type": 'application/json'});

  apiUrl: string = `${environment.hostUrl}/${environment.webContentHistoryUri}`

  postWebContentHistory(webContentHistoric: WebContentHistoric){
    return this.http.post(this.apiUrl, JSON.stringify(
      {
        'lastModifiedDate': new Date(), 
        ...webContentHistoric
      }), {headers: this.headers})
      .subscribe((response: any) => {});
  }
}
