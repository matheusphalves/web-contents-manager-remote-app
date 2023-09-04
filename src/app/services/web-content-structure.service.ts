import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LiferayProviderService } from './liferay-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WebContentStructureService {

  constructor(public http: HttpClient, private liferayProviderService: LiferayProviderService) { }

  apiUrl: string = `${this.liferayProviderService.getPortalURL()}/${environment.webContentUri}`

  siteId: string = this.liferayProviderService.getSiteId();

  getWebContentStructures(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/sites/${this.siteId}/content-structures?pageSize=-1`);
  }

}
