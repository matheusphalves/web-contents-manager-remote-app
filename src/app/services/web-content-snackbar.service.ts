import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebContentSnackbarComponent } from 'src/app/shared/web-content-snackbar/web-content-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class WebContentSnackbarService {

  constructor(public webContentSnackBar: MatSnackBar) { }

  openSnackBarWithSuccessStatus(message: string, duration?: number | undefined){
    this.openSnackBar('', message?? 'Success.', duration);
  }

  openSnackBarWithErrorStatus(message: string, duration?: number | undefined){
    this.openSnackBar('error', message?? 'Unknow error.', duration);
  }

  private openSnackBar(status: string, message: string, duration?: number | undefined){ 

    this.webContentSnackBar.openFromComponent(WebContentSnackbarComponent, {
      duration: duration?? 5000,
      data: { message: message },
      panelClass: this.getPanelClassByStatus(status)
    })


  }

  private getPanelClassByStatus(status: string){
    if(status.toLowerCase() == 'error'){
      return 'red-snackbar';
    }

    return 'blue-snackbar';
  }
}
