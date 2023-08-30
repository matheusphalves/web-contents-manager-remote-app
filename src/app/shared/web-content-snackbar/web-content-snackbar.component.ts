import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-web-content-snackbar',
  templateUrl: './web-content-snackbar.component.html',
  styleUrls: ['./web-content-snackbar.component.scss'],
  providers: [WebContentSnackbarComponent]
})
export class WebContentSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  public snackBarRef: MatSnackBarRef<WebContentSnackbarComponent>) {}


  closeSnackBar(){
    this.snackBarRef.dismiss();
  }

}
