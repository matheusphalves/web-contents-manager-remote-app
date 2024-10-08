import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebContentHistoric } from 'src/app/models/WebContentHistoric';
import { environment } from 'src/environments/environment.development';
import { LiferayProviderService } from '../liferay-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WebContentAuditorService {

  constructor(private http: HttpClient, private liferayProviderService: LiferayProviderService) { }

  headers = new HttpHeaders({ "Content-Type": 'application/json'});

  apiUrl: string = `${this.liferayProviderService.getPortalURL()}/${environment.webContentHistoryUri}`

  postWebContentHistory(webContentHistoric: WebContentHistoric){
    return this.http.post(this.apiUrl, JSON.stringify(
      {
        'lastModifiedDate': new Date(), 
        ...webContentHistoric
      }), {headers: this.headers})
      .subscribe((response: any) => {});
  }
}
