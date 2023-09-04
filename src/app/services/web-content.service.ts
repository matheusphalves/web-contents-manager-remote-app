import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WebContentModel } from '../models/WebContentModel';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LiferayProviderService } from './liferay-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WebContentService {

  constructor(private http: HttpClient, private liferayProviderService: LiferayProviderService) { }

  headers = new HttpHeaders({ "Content-Type": 'application/json'});

  apiUrl: string = `${this.liferayProviderService.getPortalURL()}/${environment.webContentUri}`

  siteId: string = this.liferayProviderService.getSiteId();

  getStructuredWebContents(search: string | undefined, pageNumber: number, pageSize: number): Observable<any>{
    
    let params = new HttpParams()
    .set('pageSize', pageSize.toString())
    .set('page', pageNumber.toString());

    if(search != undefined && search){
      params = params.set('search', search.toString())
    }

    return this.http.get<any>(`${this.apiUrl}/sites/${this.siteId}/structured-contents`, {params});
  }

  postStructuredWebContent(webContent: WebContentModel){
    return this.http.post(
      `${this.apiUrl}/sites/${this.siteId}/structured-contents`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }), {headers: this.headers})
  }

  putStructuredWebContent(webContent: WebContentModel){
    return this.http.put(
      `${this.apiUrl}/structured-contents/${webContent.id}`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }), {headers: this.headers})
  }
}
