import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateHandlerService {

  constructor() { }

  dateToIsoString(date: string): string{
    let pattern = "YYYY-MM-DDTHH:mm:ss";
    return moment(date).format(pattern) + "Z";
  }

  dateToUTCFormat(date: string){
    return date? new Date(date.replace(/-/g, '\/').replace(/T.+/, '')): null;
  }
  
}
