import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WebContentModel } from '../models/WebContentModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebContentService {

  constructor(private http: HttpClient) { }

  apiUrl: string = `${environment.hostUrl}/${environment.webContentUri}`

  getStructuredWebContents(search: string | undefined ): Observable<any>{

    const searchQuery = search != undefined && search? `?search=${search}`: ''

    return this.http.get<any>(`${this.apiUrl}/sites/${environment.siteId}/structured-contents${searchQuery}`);
  }

  postStructuredWebContent(webContent: WebContentModel){
    return this.http.post(
      `${this.apiUrl}/sites/${environment.siteId}/structured-contents`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }))
  }

  putStructuredWebContent(webContent: WebContentModel){
    return this.http.put(
      `${this.apiUrl}/structured-contents/${webContent.id}`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }))
  }
}
