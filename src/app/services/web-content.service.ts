import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WebContentModel } from '../models/WebContentModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebContentService {

  httpOptions = {headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa(`${environment.userEmail}:${environment.userPassword}`)
    })}

  constructor(private http: HttpClient) { }

  getStructuredWebContents(): Observable<any>{

    return this.http.get<any>(`${environment.apiUrl}/sites/${environment.siteId}/structured-contents`, this.httpOptions);
  }

  postStructuredWebContent(webContent: WebContentModel){
    return this.http.post(
      `${environment.apiUrl}/sites/${environment.siteId}/structured-contents`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }), 
      this.httpOptions
      )
  }

  putStructuredWebContent(webContent: WebContentModel){
    return this.http.put(
      `${environment.apiUrl}/structured-contents/${webContent.id}`, 
      JSON.stringify({
        title: webContent.title,
        contentStructureId: webContent.webContentStructure?.id,
        contentFields: webContent.contentFields
      }),
      this.httpOptions)
  }

  deleteStructuredWebContent(webContentId: number){
    return this.http.delete(`${environment.apiUrl}/structured-contents/${webContentId}`, this.httpOptions);
  }
}
