import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { LiferayProviderService } from './liferay-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WebContentDocumentService {

  constructor(
    public http: HttpClient, private liferayProviderService: LiferayProviderService) { }


  async postWebContentDocument(formData: FormData, documentFolderId: number): Promise<any> {

    const documentFolderApiUrl: string = `${this.liferayProviderService.getPortalURL()}/${environment.webContentUri}/document-folders`

    return this.http.post(`${documentFolderApiUrl}/${documentFolderId}/documents`, formData).toPromise();

  }

  async getWebContentParentFolder(): Promise<any> {
    return this.http
      .get(`${this.liferayProviderService.getPortalURL()}/${environment.webContentUri}/sites/${this.liferayProviderService.getSiteId()}/document-folders/?filter=name eq '${environment.webContentParentFolderName}'`)
      .toPromise();
  }

}
