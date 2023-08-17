import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateHandlerService } from './date-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DataTypeHandlerService {

  constructor(private dateHandlerService: DateHandlerService) { }

  handleDataType(data: string, dataType: string) {

    switch(dataType){
      case 'date':
        return this.dateHandlerService.dateToIsoString(data);
        
      default:
        return data;
    }
  }

  handleDataToBeDisplayed(data: string, dataType: string){
    
    switch(dataType){
      case 'date':
        return this.dateHandlerService.dateToUTCFormat(data);
        
      default:
        return data;
    }
  }
}
