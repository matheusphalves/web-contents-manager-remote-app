import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WebContentDocumentService {

  constructor(public http: HttpClient) { }

  documentFolderApiUrl: string = `${environment.hostUrl}/${environment.webContentUri}/document-folders`


  async postWebContentDocument(formData: FormData, documentFolderId: number): Promise<any> {

    return this.http.post(`${this.documentFolderApiUrl}/${documentFolderId}/documents`, formData).toPromise();

  }

  async getWebContentParentFolder(): Promise<any> {
    return this.http
      .get(`${environment.hostUrl}/${environment.webContentUri}/sites/${environment.siteId}/document-folders/?filter=name eq '${environment.webContentParentFolderName}'`)
      .toPromise();
  }

}
