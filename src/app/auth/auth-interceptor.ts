import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

import { AuthService } from "./auth.service";

// Interceptors are an official feature provided by the Angular HTTP Client

// To inject services into other services, we have to have the @Injectable() annotation
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {
    }

    // The interface forces you to add an interface() method.
    // This is the contract you're signing by implementing this interface (with keyword "implements").
    // Angular will call this method for requests leaving your app.
    // ________________
    // We write "<any>" because we want to intercept any outgoing requests, not a specific one (this is a static type <>).
    // "next" allows us to leave the interceptor and allow other parts to also take the request so it continues its journey
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();

        // we should clone this request before we manipulate (by attaching a token to its header) it because if you directly
        // edit that outgoing request, you will cause unwanted side effects and problems due to the way requests work
        // internally and are handled internally
        const authRequest = req.clone({
            // This is 'Authorization' because in the backend in "check-auth.js", we wrote:
            //     const token = req.headers.authorization.split(' ')[1];
            // and the "authorization" is case insensitive but should be the same name here in the frontend
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });

        // this lets the request keep going
        return next.handle(authRequest);
    }
}

// Note: we also have to add the "Authorization" header to our CORS policies, set in the backend in app.js

// Note: "set()" just adds a new header, not overwrites existing ones. But if that specific header already existed,
// it would be overwritten