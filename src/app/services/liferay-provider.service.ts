import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
declare const Liferay: any;

@Injectable({
  providedIn: 'root'
})
export class LiferayProviderService {

  constructor() { }

  getSiteId(){
    
    if(Liferay.ThemeDisplay.getSiteGroupId() != 0){
      return Liferay.ThemeDisplay.getSiteGroupId()
    }

    return environment.siteId;
  }

  getPortalURL(){
    if(Liferay.ThemeDisplay.getPortalURL()  != '/'){
      return Liferay.ThemeDisplay.getPortalURL()
    }

    return environment.hostUrl
  }

  handleAuthStrategy(): any{

    if(Liferay.authToken.length > 0){
        return {'x-csrf-token': Liferay.authToken}
    }

    return {'Authorization': 'Basic ' + btoa(`${environment.userEmail}:${environment.userPassword}`)}
}
}
