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

  getStructuredWebContents(): Observable<any>{

    return this.http.get<any>(`${environment.apiUrl}/sites/${environment.siteId}/structured-contents`);
  }

  postStructuredWebContent(webContent: WebContentModel){
    return this.http.post(
      `${environment.apiUrl}/sites/${environment.siteId}/structured-contents`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }))
  }

  putStructuredWebContent(webContent: WebContentModel){
    return this.http.put(
      `${environment.apiUrl}/structured-contents/${webContent.id}`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }))
  }

  deleteStructuredWebContent(webContentId: number){
    return this.http.delete(`${environment.apiUrl}/structured-contents/${webContentId}`);
  }
}
