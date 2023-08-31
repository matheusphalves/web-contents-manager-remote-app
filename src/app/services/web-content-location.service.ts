import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebContentLocationService {

  constructor(public http: HttpClient) { }

  apiUrl: string = `${environment.hostUrl}/${environment.webContentLocationUri}`

  getWebContentLocations(): Observable<any>{
    return this.http.get<any>(`${environment.hostUrl}/${environment.webContentLocationUri}`);
  }
}
