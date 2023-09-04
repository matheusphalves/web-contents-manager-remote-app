import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LiferayProviderService } from "../services/liferay-provider.service";

export class BasicAuthInterceptor implements HttpInterceptor{

    constructor(public liferayProviderService: LiferayProviderService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const clonedRequest = req.clone({
            setHeaders: this.liferayProviderService.handleAuthStrategy()
        })

        return next.handle(clonedRequest);
    }
}