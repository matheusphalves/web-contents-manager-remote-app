import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebContentHistoric } from 'src/app/models/WebContentHistoric';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebContentAuditorService {

  constructor(private http: HttpClient) { }

  apiUrl: string = `${environment.hostUrl}/${environment.webContentHistoryUri}`

  postWebContentHistory(webContentHistoric: WebContentHistoric){
    console.log(webContentHistoric)
    return this.http.post(this.apiUrl, JSON.stringify(webContentHistoric))
      .subscribe((response: any) => {});
  }
}
