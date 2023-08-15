import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";

export class BasicAuthInterceptor implements HttpInterceptor{
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const clonedRequest = req.clone({
            setHeaders: {
                'Content-Type':  'application/json',
                'Authorization': 'Basic ' + btoa(`${environment.userEmail}:${environment.userPassword}`)
              }
        })

        return next.handle(clonedRequest);
    }

}