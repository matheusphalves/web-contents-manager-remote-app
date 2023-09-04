import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LiferayProviderService } from '../auth/liferay-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WebContentLocationService {

  constructor(public http: HttpClient, private liferayProviderService: LiferayProviderService) { }

  getWebContentLocations(): Observable<any>{
    return this.http.get<any>(`${this.liferayProviderService.getPortalURL()}/${environment.webContentLocationUri}`);
  }
}
